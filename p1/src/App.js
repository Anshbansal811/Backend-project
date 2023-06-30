import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function App(){

  const [number,setNumber]=useState('');
  const [data, setData] = useState([]);
 

const request = window.indexedDB.open('myDatabase', 4);

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  // Create an object store to store the API data
  const objectStore = db.createObjectStore('apida', { keyPath: "indx", });
};

// Handle database connection success
request.onsuccess = function(event) {
  const db = event.target.result;

// *********************************
// Retrieve the current value from localStorage
let front = localStorage.getItem('myVariable');

// Check if the value exists
if (front) {
  console.log("hellogg")
  console.log(front)
  // If it exists, convert it to a number and increment it
  // front = parseInt(front) + 1;
} else {
  // If it doesn't exist, set it to 1
  front = 25;
}



  // Fetch data from the API
  fetch('http://universities.hipolabs.com/search?country=United+States')
    .then(response => response.json())
    .then(data => {
      // Start a transaction to store the API data in IndexedDB
      const transaction = db.transaction('apida', 'readwrite');
      const objectStore = transaction.objectStore('apida');
      // Store each data item in the object store
      //if('indx')
      // objectStore.put({"front":24, "size":25, "indx":25});
      // for(let i=9;i>=0;i--){
        console.log(front)
      let i = number;
      while(i--){
        front=(parseInt(front)+parseInt(24))%25;
        // front = (((front)+24)%25);
        console.log("Ansh");
        console.log(i);
        console.log(front);
        objectStore.delete(front)
        data[i]['indx'] = front;
        objectStore.put(data[i]);
     }

    // Store the updated value back in localStorage
    localStorage.setItem('myVariable', front);

    // Print the updated value
    console.log('Updated value:', front);
    

    //  console.log(objectStore.getKey(2000))
      // objectStore.delete(0)
      transaction.oncomplete = function() {
        console.log('Data stored successfully!');
      };

      // Handle transaction errors
      transaction.onerror = function(event) {
        console.error('Transaction error:', event.target.error);  
      };
    })
    .catch(error => {
      console.error('API fetch error:', error);
    });
    
};

// Handle database connection errors
request.onerror = function(event) {
  console.error('Database error:', event.target.error);
};
useEffect(() => {
  const fetchData = async () => {
    const database = await openDatabase();
    const retrievedData = await retrieveData(database);
    setData(retrievedData);
  };

  fetchData();
}, []);

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 4);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject();
    };

    request.onsuccess = (event) => {
      const database = event.target.result;
      resolve(database);
    };
  });
};

const retrieveData = (database) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('apida', 'readwrite');
    const objectStore = transaction.objectStore('apida');
    const request = objectStore.openCursor();
    let count = 0;

    const retrievedData = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor && count < 25) {
        retrievedData.push(cursor.value);
        cursor.continue();
        count++;
      } else {
        resolve(retrievedData);
      }
    };

    request.onerror = (event) => {
      console.error('Data retrieval error:', event.target.error);
      reject();
    };
  });
};

  const submite=async(e)=>{
    e.preventDefault()
    
    try {
      await axios.post("http://localhost:8000/",{number})    
    } catch (error) {
      console.log(error)
    }
  }

  const LoadMore=async(e)=>{
    e.preventDefault()
    
    try {
      const data = await axios.get("mongodb+srv://anshbansal811:ptiRRI9nHI81dp8e@e-commerc.vewyddv.mongodb.net/companyproject/posts");    
      console.log(data.name);
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <div className='cont'>
    <form action='POSt'>
      <input type="Number" onChange={(e)=>{setNumber(e.target.value)}}></input>
      <button type='submite' onClick={ submite } value="Submite" >Submit</button>
      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>country</th>
          <th>alpha_two_code</th>
          <th>name</th>
          <th>domains</th>
          <th>web_pages</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.country}</td>
            <td>{row.alpha_two_code}</td>
            <td>{row.name}</td>
            <td>{row.domains}</td>
            <td>{row.web_pages}</td>
          </tr>
        ))}
        <button type='submite' onClick={ LoadMore } value="LoadMore" >LoadMore</button>
      </tbody>
    </table>
    </form>
    </div>
  )
}


