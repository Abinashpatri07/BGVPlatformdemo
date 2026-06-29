import axios from 'axios';

async function check() {
  try {
    const res = await axios.get("http://localhost:5000/api/hr/get-all");
    console.log("Super Admin HRs:", res.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}
check();
