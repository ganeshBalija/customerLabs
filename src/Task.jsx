import React, { useState } from 'react';


let schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

function App() {
  let [Popup, setPopup] = useState(false);
  let [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  let [selectedSchema, setSelectedSchema] = useState('');
  let [segmentName, setSegmentName] = useState('');
  let [selectedSchemas, setSelectedSchemas] = useState([]);
  
   let close=(()=>{
    setPopup(false)
   })
  let handleAddSchema = () => {
    if (selectedSchema) {
      let newSchema = schemaOptions.find(option => option.value === selectedSchema);
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableSchemas(availableSchemas.filter(option => option.value !== selectedSchema));
      setSelectedSchema('');
    }
  };

  let handleSchemaChange = (index, newValue) => {
    let updatedSchemas = selectedSchemas.map((schema, i) => i === index ? newValue : schema);
    setSelectedSchemas(updatedSchemas);
   let newAvailableSchemas = schemaOptions.filter(option => !updatedSchemas.includes(option));
    setAvailableSchemas(newAvailableSchemas);
  };

  let handleSaveSegment = () => {
    let data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };
    
    fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="App">
      <button class="segmentButton" onClick={() => setPopup(true)}>Save segment</button>
  
      {Popup && (
        <div className="popup">
          <h2 id="savesegment">Save Segment</h2>
          <br /><br />
          <label >
           Segment Name:
            <input id="saveSegment" placeholder=' Enter Segment Name'
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </label>
          <br /><br />
          <div id="selectSchema" className="blue-box">
            {selectedSchemas.map((schema, index) => (
              <div key={index} >
                <select 
                  value={schema.value}
                  onChange={(e) =>
                    handleSchemaChange(
                      index,
                      schemaOptions.find((option) => option.value === e.target.value)
                    )
                  }>

                  {schemaOptions
                    .filter((option) => !selectedSchemas.includes(option) || option.value === schema.value)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select><br />
              </div>
            ))}
          </div>
          {availableSchemas.length > 0 && (
            <>
              <select 
                value={selectedSchema} 
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                <option value="" class="schema">Add schema to segment</option>
                {availableSchemas.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select><br /><br />
            </>
          )}
          <button onClick={handleAddSchema} class="schema">+Add new schema</button><br /><br />
          <div class="saveAndCloseButton">
          <button class="button" onClick={handleSaveSegment}>Save segment</button><br /><br />
          <button class="button" onClick={close}>close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;