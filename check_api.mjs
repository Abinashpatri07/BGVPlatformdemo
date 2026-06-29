import axios from 'axios';

async function check() {
  try {
    const res = await axios.get("http://localhost:5000/api/client-admin/hr/get-all?clientId=1");
    console.log("HRs for client 1:", res.data);
    const overRes = await axios.get("http://localhost:5000/api/client-admin/hr/overview?clientId=1");
    console.log("Overview for client 1:", overRes.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}
check();
