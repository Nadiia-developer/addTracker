// import React, {useEffect, useState} from "react";
// import axios from "axios";
// import './App.css';
//
// function App() {
//     const [campaigns, setCampaigns] = useState([]);
//
//     useEffect(() => {
//         axios.get('http://localhost:8000/api/campaigns/')
//         .then(response => {
//             setCampaigns(response.data);
//         })
//             .catch(error => {
//                 console.error("Error fetching the items", error);
//             });
//     }, []);
//
//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1>Welcome to React</h1>
//                 <p>React with Django</p>
//                 <h2>Items:</h2>
//                 <ul>{campaigns.map(campaign => (
//                     <li key={campaign.id}>
//                         <h3>{campaign.name}</h3>
//                         <p>{campaign.goal}</p>
//                     </li>
//                 ))}</ul>
//             </header>
//         </div>
//     );
// }
//
// export default App;
// ****************************************************************************************

import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BarChart from "./components/BarChart";

const App = () => {
    return (
        <div>
            <Header/>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '20px', padding: '20px', flexGrow: 1 }}>
                    <BarChart />
                </main>
            </div>
        </div>
    );
};

export default App;
