import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import { useState,useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-calendar-heatmap/dist/styles.css';
import api from '../../api';
const SpendingHeatmap = ({ transactions }) => {
  const [expenses ,setexpenses]=useState([]);
  const currentYear = new Date().getFullYear();
  useEffect(()=>{
      const fetchexpenses=async()=>{
        try{
          const res = await api.get("/allexpenses");
          if(res.length >0){
            setexpenses(res);
          }
        }
        catch(err){
          console.log(err);
        }
      }
      fetchexpenses();
    },[]);

  const data = expenses .reduce((acc, t) => {const rawDate = t.CreatedAt; 
    if (!rawDate) return acc;

    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return acc;

    const date = parsed.toISOString().slice(0, 10);

    const existing = acc.find(item => item.date === date);
    if (existing) 
      existing.count += Number(t.amount);
    else acc.push({ date:date, count: Number(t.amount) });
      return acc;
    }, []);
    console.log("Heatmap data:", data); 

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Spending Intensity</h3>
      <CalendarHeatmap
        startDate={new Date(`${currentYear}-01-01`)}
        endDate={new Date(`${currentYear}-12-31`)}
        values={data}
        tooltipDataAttrs={(value) => {
          return {
            'data-tooltip-id': 'spending-tooltip',
            'data-tooltip-content': value && value.date 
              ? `${value.date}: ₹${value.count}` 
              : 'No activity',
          };
        }}
        classForValue={(value) => {
          if (!value) return 'fill-gray-100';
          if (value.count > 500) return 'fill-red-500';
          if (value.count > 300) return 'fill-red-300';
          if (value.count > 100) return 'fill-red-100';
          return 'fill-red-50';
        }}
      />
      <Tooltip 
        id="spending-tooltip" 
        place="top"
        style={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "8px", zIndex: 100 }}
      />
      <style>{`
        .react-calendar-heatmap .fill-red-50  { fill: #fff1f2; }
        .react-calendar-heatmap .fill-gray-100 { fill: #f3f4f6; }
        .react-calendar-heatmap .fill-red-100 { fill: #fee2e2; }
        .react-calendar-heatmap .fill-red-300 { fill: #fca5a5; }
        .react-calendar-heatmap .fill-red-500 { fill: #ef4444; }
      `}</style>
    </div>
  );
};
export default SpendingHeatmap;