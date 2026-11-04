
import {useEffect,useState} from "react",
import { LuClock, LuLogIn, LuLogOut } from "react-icons/lu";
import api from "../../services/api";


const formateTime =(iso)=>
    new Date(iso).toLocaleTimeString("en-GB", {
       hour: "2-digit",
       minute: "2-digit",
       timeZone: "Asia/Colombo",
       });

const formatDuration = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

function Attendance(){
    const [attendance,setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
}

useEffect(() => {
  const loadToday = async () => {
    try {
      
      const res = await api.get("/attendance/today");

      
      setAttendance(res.data.attendance);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  loadToday();
}, []);