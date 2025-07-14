// // FILE: Recommendations.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// interface Recommendation {
//   id: number;
//   supply_name: string;
//   suggested_quantity: number;
//   eco_friendly_suppliers: string[];
// }

// const Recommendations: React.FC = () => {
//   const { user } = useAuth();
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch recommendations from the backend
//   const fetchRecommendations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("/recommendations");
//       setRecommendations(response.data.recommendations);
//     } catch (err) {
//       setError("Failed to fetch recommendations. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve a recommendation
//   const approveRecommendation = async (id: number) => {
//     try {
//       await axios.post(`/recommendations/${id}/approve`);
//       setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
//     } catch (err) {
//       setError("Failed to approve the recommendation. Please try again.");
//     }
//   };

//   // Reject a recommendation
//   const rejectRecommendation = async (id: number) => {
//     try {
//       await axios.post(`/recommendations/${id}/reject`);
//       setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
//     } catch (err) {
//       setError("Failed to reject the recommendation. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold text-[#2E7D32] mb-6">Ordering Recommendations</h1>
//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : recommendations?.length === 0 ? (
//         <p className="text-center text-gray-500">No recommendations available.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recommendations.map((rec) => (
//             <div key={rec.id} className="bg-white p-4 rounded shadow-md">
//               <h2 className="text-lg font-bold text-gray-800">{rec.supply_name}</h2>
//               <p className="text-gray-700">Suggested Quantity: {rec.suggested_quantity}</p>
//               <p className="text-gray-700">Eco-Friendly Suppliers:</p>
//               <ul className="list-disc list-inside text-gray-600">
//                 {rec.eco_friendly_suppliers.map((supplier, index) => (
//                   <li key={index}>{supplier}</li>
//                 ))}
//               </ul>
//               {user?.role === "admin" && (
//                 <div className="mt-4 flex space-x-2">
//                   <button
//                     onClick={() => approveRecommendation(rec.id)}
//                     className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => rejectRecommendation(rec.id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recommendations;   








// // FILE: RecommendationPage.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import "../styles/AnimatedBackground.css";

// const RecommendationPage: React.FC = () => {
//   const { user } = useAuth();
//   const [recommendations, setRecommendations] = useState<any[]>([
//     {
//       supply_id: 1,
//       current_stock: 50,
//       average_weekly_usage: 10,
//       recommended_order_quantity: 20,
//       supplier: "EcoSupplier Inc.",
//     },
//     {
//       supply_id: 2,
//       current_stock: 100,
//       average_weekly_usage: 25,
//       recommended_order_quantity: 30,
//       supplier: "Green Supplies Co.",
//     },
//   ]);
//   const [alerts, setAlerts] = useState<any[]>([
//     {
//       supply_id: 3,
//       name: "Paper",
//       alert: "Overstocking",
//       quantity: 200,
//     },
//     {
//       supply_id: 4,
//       name: "Ink Cartridges",
//       alert: "Nearing expiration",
//       expiration_date: new Date(2024, 11, 31), // December 31, 2024
//     },
//   ]);
//   const [loading, setLoading] = useState<boolean>(false); // No loading with dummy data
//   const [error, setError] = useState<string | null>(null);

//   // No need to fetch data with dummy data
//   // const fetchRecommendations = async () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const [recommendationsRes, alertsRes] = await Promise.all([
//   //       axios.get("/recommendations"), // Fetch order recommendations
//   //       axios.get("/alerts"), // Fetch waste alerts
//   //     ]);
//   //     setRecommendations(recommendationsRes.data);
//   //     setAlerts(alertsRes.data);
//   //   } catch (err: any) {
//   //     setError(
//   //       "Failed to fetch recommendations and alerts data. Please try again later."
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchRecommendations();
//   // }, []);

//   return (
//     <>
//       <div className="animated-bg"></div>

//       <div className="container mx-auto p-4 relative z-10">
//         <h1 className="text-2xl font-bold mb-4">Recommendations & Alerts</h1>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Recommendations */}
//             <div className="bg-white p-4 rounded shadow-md mb-4">
//               <h2 className="text-lg font-bold text-gray-800 mb-2">
//                 Order Recommendations
//               </h2>
//               {recommendations.length > 0 ? (
//                 <table className="table-auto w-full">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2">Supply ID</th>
//                       <th className="px-4 py-2">Current Stock</th>
//                       <th className="px-4 py-2">Avg Weekly Usage</th>
//                       <th className="px-4 py-2">Recommended Order</th>
//                       <th className="px-4 py-2">Supplier</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recommendations.map((rec: any) => (
//                       <tr key={rec.supply_id}>
//                         <td className="border px-4 py-2">{rec.supply_id}</td>
//                         <td className="border px-4 py-2">{rec.current_stock}</td>
//                         <td className="border px-4 py-2">
//                           {rec.average_weekly_usage}
//                         </td>
//                         <td className="border px-4 py-2">
//                           {rec.recommended_order_quantity}
//                         </td>
//                         <td className="border px-4 py-2">{rec.supplier}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No recommendations at this time.</p>
//               )}
//             </div>

//             {/* Waste Alerts */}
//             <div className="bg-white p-4 rounded shadow-md">
//               <h2 className="text-lg font-bold text-gray-800 mb-2">
//                 Waste Alerts
//               </h2>
//               {alerts.length > 0 ? (
//                 <table className="table-auto w-full">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2">Supply ID</th>
//                       <th className="px-4 py-2">Name</th>
//                       <th className="px-4 py-2">Alert Type</th>
//                       <th className="px-4 py-2">Details</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {alerts.map((alert: any) => (
//                       <tr key={alert.supply_id}>
//                         <td className="border px-4 py-2">{alert.supply_id}</td>
//                         <td className="border px-4 py-2">{alert.name}</td>
//                         <td className="border px-4 py-2">{alert.alert}</td>
//                         <td className="border px-4 py-2">
//                           {alert.alert === "Overstocking"
//                             ? `Quantity: ${alert.quantity}`
//                             : `Expiration Date: ${new Date(
//                                 alert.expiration_date
//                               ).toLocaleDateString()}`}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No alerts at this time.</p>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default RecommendationPage;





// // FILE: Recommendations.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import "../styles/AnimatedBackground.css";

// interface Recommendation {
//   id: number;
//   supply_name: string;
//   suggested_quantity: number;
//   eco_friendly_suppliers: string[];
// }

// const Recommendations: React.FC = () => {
//   const { user } = useAuth();
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([
//     {
//       id: 1,
//       supply_name: "Paper",
//       suggested_quantity: 500,
//       eco_friendly_suppliers: ["EcoPaper Co.", "Green Tree Supplies"],
//     },
//     {
//       id: 2,
//       supply_name: "Pens",
//       suggested_quantity: 200,
//       eco_friendly_suppliers: ["Sustainable Pens Inc."],
//     },
//     {
//       id: 3,
//       supply_name: "Coffee Pods",
//       suggested_quantity: 100,
//       eco_friendly_suppliers: ["Ethical Coffee Ltd."],
//     },
//   ]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Approve a recommendation
//   const approveRecommendation = async (id: number) => {
//     try {
//       // await axios.post(`/recommendations/${id}/approve`); // Commented out API call
//       setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
//     } catch (err) {
//       setError("Failed to approve the recommendation. Please try again.");
//     }
//   };

//   // Reject a recommendation
//   const rejectRecommendation = async (id: number) => {
//     try {
//       // await axios.post(`/recommendations/${id}/reject`); // Commented out API call
//       setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
//     } catch (err) {
//       setError("Failed to reject the recommendation. Please try again.");
//     }
//   };

//   // useEffect(() => {
//   //   fetchRecommendations();
//   // }, []);

//   return (
//     <>
//       <div className="animated-bg"></div>
//       <div className="container mx-auto p-4 relative z-10">
//         <h1 className="text-2xl font-bold text-[#2E7D32] mb-6">
//           Ordering Recommendations
//         </h1>
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : recommendations?.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No recommendations available.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {recommendations.map((rec) => (
//               <div key={rec.id} className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-bold text-gray-800">
//                   {rec.supply_name}
//                 </h2>
//                 <p className="text-gray-700">
//                   Suggested Quantity: {rec.suggested_quantity}
//                 </p>
//                 <p className="text-gray-700">Eco-Friendly Suppliers:</p>
//                 <ul className="list-disc list-inside text-gray-600">
//                   {rec.eco_friendly_suppliers.map((supplier, index) => (
//                     <li key={index}>{supplier}</li>
//                   ))}
//                 </ul>
//                 {user?.role === "admin" && (
//                   <div className="mt-4 flex space-x-2">
//                     <button
//                       onClick={() => approveRecommendation(rec.id)}
//                       className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] transition duration-300"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => rejectRecommendation(rec.id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Recommendations;




// FILE: Recommendations.tsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const greeneryImg = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80";
// // const recycleImg = "../assets/Recycle.jpg"; // Local image path

// interface Recommendation {
//   supply_id: number;
//   supply_name: string;
//   recommended_order_quantity: number;
//   eco_friendly_supplier: string;
// }

// const Recommendations: React.FC = () => {
//   const { user } = useAuth();
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRecommendations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("/recommendations");
//       setRecommendations(response.data.recommendations || []);
//     } catch (err) {
//       setError("Failed to fetch recommendations. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   return (
//     <>
//       <div className="animated-bg"></div>

//       {/* Banner Header */}
//       <div className="relative w-full h-40 md:h-56 rounded-lg overflow-hidden shadow-lg mb-8">
//         <img
//           src={greeneryImg}
//           alt="Greenery"
//           className="w-full h-full object-cover opacity-80"
//         />
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
//           <div className="flex items-center gap-3 mb-2">
//             <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
//               Order Recommendations
//             </h1>
//             <img
//               src={"/recyclelogo.png"}
//               alt="Recycle"
//               className="w-12 h-12 object-contain"
//               style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
//             />
//           </div>
//           <p className="text-xl text-green-300 font-medium">
//             Track, Save, and Go Green 🌱
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto p-4 relative z-10">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading recommendations...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : recommendations.length === 0 ? (
//           <p className="text-center text-gray-500">No recommendations available.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {recommendations.map((rec) => (
//               <div key={rec.supply_id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-400">
//                 <h2 className="text-lg font-bold text-gray-800 mb-2">{rec.supply_name}</h2>
//                 <p className="text-gray-700 mb-1">
//                   <span className="font-medium text-green-700">Recommended Quantity:</span>{" "}
//                   {rec.recommended_order_quantity}
//                 </p>
//                 <p className="text-gray-700">
//                   <span className="font-medium text-green-700">Eco-Friendly Supplier:</span>{" "}
//                   {rec.eco_friendly_supplier}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Recommendations;









//WITHOUT IMAGE

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import "../styles/AnimatedBackground.css";

// const RecommendationPage: React.FC = () => {
//   const { user } = useAuth();
//   const [recommendations, setRecommendations] = useState<any[]>([
//     {
//       supply_id: 1,
//       current_stock: 50,
//       average_weekly_usage: 10,
//       recommended_order_quantity: 20,
//       supplier: "EcoSupplier Inc.",
//     },
//     {
//       supply_id: 2,
//       current_stock: 100,
//       average_weekly_usage: 25,
//       recommended_order_quantity: 30,
//       supplier: "Green Supplies Co.",
//     },
//   ]);
//   const [alerts, setAlerts] = useState<any[]>([
//     {
//       supply_id: 3,
//       name: "Paper",
//       alert: "Overstocking",
//       quantity: 200,
//     },
//     {
//       supply_id: 4,
//       name: "Ink Cartridges",
//       alert: "Nearing expiration",
//       expiration_date: new Date(2024, 11, 31), // December 31, 2024
//     },
//   ]);
//   const [loading, setLoading] = useState<boolean>(false); // No loading for dummy data
//   const [error, setError] = useState<string | null>(null);

//   // Uncomment this block when your API is ready to fetch real data
//   /*
//   const fetchRecommendations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [recommendationsRes, alertsRes] = await Promise.all([
//         axios.get("/recommendations"), // Fetch order recommendations
//         axios.get("/alerts"), // Fetch waste alerts
//       ]);
//       setRecommendations(recommendationsRes.data);
//       setAlerts(alertsRes.data);
//     } catch (err: any) {
//       setError(
//         "Failed to fetch recommendations and alerts data. Please try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);
//   */

//   return (
//     <>
//       <div className="animated-bg"></div>

//       <div className="container mx-auto p-4 relative z-10">
//         <h1 className="text-2xl font-bold mb-4">Recommendations & Alerts</h1>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Recommendations */}
//             <div className="bg-white p-4 rounded shadow-md mb-4">
//               <h2 className="text-lg font-bold text-gray-800 mb-2">
//                 Order Recommendations
//               </h2>
//               {recommendations.length > 0 ? (
//                 <table className="table-auto w-full">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2">Supply ID</th>
//                       <th className="px-4 py-2">Current Stock</th>
//                       <th className="px-4 py-2">Avg Weekly Usage</th>
//                       <th className="px-4 py-2">Recommended Order</th>
//                       <th className="px-4 py-2">Supplier</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {recommendations.map((rec: any) => (
//                       <tr key={rec.supply_id}>
//                         <td className="border px-4 py-2">{rec.supply_id}</td>
//                         <td className="border px-4 py-2">{rec.current_stock}</td>
//                         <td className="border px-4 py-2">{rec.average_weekly_usage}</td>
//                         <td className="border px-4 py-2">{rec.recommended_order_quantity}</td>
//                         <td className="border px-4 py-2">{rec.supplier}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No recommendations at this time.</p>
//               )}
//             </div>

//             {/* Waste Alerts */}
//             <div className="bg-white p-4 rounded shadow-md">
//               <h2 className="text-lg font-bold text-gray-800 mb-2">Waste Alerts</h2>
//               {alerts.length > 0 ? (
//                 <table className="table-auto w-full">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2">Supply ID</th>
//                       <th className="px-4 py-2">Name</th>
//                       <th className="px-4 py-2">Alert Type</th>
//                       <th className="px-4 py-2">Details</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {alerts.map((alert: any) => (
//                       <tr key={alert.supply_id}>
//                         <td className="border px-4 py-2">{alert.supply_id}</td>
//                         <td className="border px-4 py-2">{alert.name}</td>
//                         <td className="border px-4 py-2">{alert.alert}</td>
//                         <td className="border px-4 py-2">
//                           {alert.alert === "Overstocking"
//                             ? `Quantity: ${alert.quantity}`
//                             : `Expiration Date: ${new Date(
//                                 alert.expiration_date
//                               ).toLocaleDateString()}`}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No alerts at this time.</p>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default RecommendationPage;






















import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AnimatedBackground.css";

const RecommendationPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([
    {
      supply_id: 1,
      current_stock: 50,
      average_weekly_usage: 10,
      recommended_order_quantity: 20,
      supplier: "EcoSupplier Inc.",
    },
    {
      supply_id: 2,
      current_stock: 100,
      average_weekly_usage: 25,
      recommended_order_quantity: 30,
      supplier: "Green Supplies Co.",
    },
  ]);
  const [alerts, setAlerts] = useState<any[]>([
    {
      supply_id: 3,
      name: "Paper",
      alert: "Overstocking",
      quantity: 200,
    },
    {
      supply_id: 4,
      name: "Ink Cartridges",
      alert: "Nearing expiration",
      expiration_date: new Date(2024, 11, 31), // December 31, 2024
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false); // No loading for dummy data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendationsAndAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recommendationsRes, alertsRes] = await Promise.all([
          axios.get("http://localhost:8000/inventory/recommendations"),
          axios.get("http://localhost:8000/inventory/alerts"),
        ]);
        setRecommendations(recommendationsRes.data);
        setAlerts(alertsRes.data);
      } catch (err: any) {
        setError("Failed to fetch recommendations and alerts data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendationsAndAlerts();
  }, []);

  // Uncomment this block when your API is ready to fetch real data
  /*
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recommendationsRes, alertsRes] = await Promise.all([
        axios.get("/recommendations"), // Fetch order recommendations
        axios.get("/alerts"), // Fetch waste alerts
      ]);
      setRecommendations(recommendationsRes.data);
      setAlerts(alertsRes.data);
    } catch (err: any) {
      setError(
        "Failed to fetch recommendations and alerts data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  
  */

  return (
    <>
      {/* Remove the old animated-bg div if not needed */}
      {/* <div className="animated-bg"></div> */}

      {/* Background wrapper */}
      <div
        className="min-h-screen bg-no-repeat bg-center bg-cover flex items-start pt-10"
        style={{ backgroundImage: "url('/image.jpg')" }}
      >
        {/* Content container */}
        <div className="container mx-auto p-6 relative z-10 bg-white bg-opacity-90 rounded shadow-md max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Recommendations & Alerts</h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Recommendations */}
              <div className="p-4 rounded mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Order Recommendations
                </h2>
                {recommendations.length > 0 ? (
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Supply ID</th>
                        <th className="border px-4 py-2">Current Stock</th>
                        <th className="border px-4 py-2">Avg Weekly Usage</th>
                        <th className="border px-4 py-2">Recommended Order</th>
                        <th className="border px-4 py-2">Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.map((rec: any) => (
                        <tr key={rec.supply_id}>
                          <td className="border px-4 py-2">{rec.supply_id}</td>
                          <td className="border px-4 py-2">{rec.current_stock}</td>
                          <td className="border px-4 py-2">{rec.average_weekly_usage}</td>
                          <td className="border px-4 py-2">{rec.recommended_order_quantity}</td>
                          <td className="border px-4 py-2">{rec.supplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No recommendations at this time.</p>
                )}
              </div>

              {/* Waste Alerts */}
              <div className="p-4 rounded">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Waste Alerts</h2>
                {alerts.length > 0 ? (
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Supply ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Alert Type</th>
                        <th className="border px-4 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((alert: any) => (
                        <tr key={alert.supply_id}>
                          <td className="border px-4 py-2">{alert.supply_id}</td>
                          <td className="border px-4 py-2">{alert.name}</td>
                          <td className="border px-4 py-2">{alert.alert}</td>
                          <td className="border px-4 py-2">
                            {alert.alert === "Overstocking"
                              ? `Quantity: ${alert.quantity}`
                              : `Expiration Date: ${new Date(
                                alert.expiration_date
                              ).toLocaleDateString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No alerts at this time.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RecommendationPage;
