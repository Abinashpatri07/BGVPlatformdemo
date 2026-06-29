import axios from 'axios';

async function check() {
  try {
    // Get all HRs and check what columns exist
    const res = await axios.get("http://localhost:5000/api/hr/get-all");
    console.log("Full first record:", JSON.stringify(res.data.data[0], null, 2));

    // Check if 'created_by' column exists by trying to add test user
    const addRes = await axios.get("http://localhost:5000/api/client-admin/hr/get-all");
    console.log("CA Full first record:", JSON.stringify(addRes.data.data[0], null, 2));
  } catch(e) {
    console.log("Error:", e.response?.data || e.message);
  }
}
check();
