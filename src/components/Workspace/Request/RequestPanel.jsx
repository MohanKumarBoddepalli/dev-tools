import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { convertKeyValueToObject } from '../../../utils/helpers';
import UrlEditor from '../../Panes/RequestUrl/UrlEditor';
import RequestTabGroup from '../../Tab-Groups/RequestTabGroup';
import { generateDocs } from '../../ApiDocLogic';

const keyPairInitState = [
  {
    id: uuidv4(),
    keyItem: '',
    valueItem: '',
  },
];

export default function Request({ setResponse, setLoading, loading }) {
  const [url, setUrl] = useState(
    'https://jsonplaceholder.typicode.com/todos/1'
  );
  const [reqMethod, setReqMethod] = useState('GET');
  const [formData, setFormData] = useState({
    name: '',
    groupName: '',
    version: '',
    description: '',
  });
  const [queryParams, setQueryParams] = useState(keyPairInitState);
  const [headers, setHeaders] = useState(keyPairInitState);
  const [body, setBody] = useState('{}');

  useEffect(() => {
    const storedFormData = {
      name: localStorage.getItem('name') || '',
      groupName: localStorage.getItem('groupName') || '',
      version: localStorage.getItem('version') || '',
      description: localStorage.getItem('description') || '',
    };
    setFormData(storedFormData);
    const body = localStorage.getItem('body') || {};
    setBody(body);
  }, []);

  const handleOnInputSend = async (e) => {
    setLoading(true);

    e.preventDefault();
    const requestBody = body.toString();

    let data;
    try {
      data = JSON.parse(requestBody);
    } catch (e) {
      alert('Something is wrong with the JSON data.');
    }

    try {
      const response = await axios({
        url,
        method: reqMethod,
        params: convertKeyValueToObject(queryParams),
        headers: convertKeyValueToObject(headers),
        data,
      });

      const queryParamss = convertKeyValueToObject(queryParams);
      const apiDoc = generateDocs({
        url,
        method: reqMethod,
        queryParams: convertKeyValueToObject(queryParams),
        body: data,
        formData,
        response: response.data
      });

      response.apiDoc = apiDoc;
      setResponse(response);

    } catch (e) {
      console.log(e);
      setResponse(e);
    }

    setLoading(false);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [id]: value };
      localStorage.setItem(id, value);
      return newData;
    });
  };

  const addBody = (data) => {
    setBody(data);
      localStorage.setItem('body', data);
  }

  const inputFields = [
    { label: 'Name:', id: 'name', value: formData.name },
    { label: 'Group Name:', id: 'groupName', value: formData.groupName },
    { label: 'Version:', id: 'version', value: formData.version },
    { label: 'Description:', id: 'description', value: formData.description }
  ];

  return (
    <>
      <UrlEditor
        url={url}
        setUrl={setUrl}
        reqMethod={reqMethod}
        setReqMethod={setReqMethod}
        onInputSend={handleOnInputSend}
      />
      <div className='p-2 grid grid-cols-3 gap-4 items-center'>
        {inputFields.map((field) => (
            <div key={field.id} className={field.id === 'description' ? "col-span-3" : "col-span-1"}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                className='ml-3 px-4 py-2 border rounded-md border-gray-300 hover:border-orange-500 focus:outline-orange-500 w-full'
                type="text"
                id={field.id}
                value={field.value}
                onChange={handleInputChange}
              />
            </div>
        ))}
      </div>
      <RequestTabGroup
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        headers={headers}
        setHeaders={setHeaders}
        body={localStorage.getItem('body')}
        setBody={addBody}
      />
    </>
  );
} 
