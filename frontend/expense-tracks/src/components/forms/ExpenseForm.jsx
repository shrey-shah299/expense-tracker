import React, { useState } from 'react';
import { TrendingDown } from 'lucide-react';
import InputBox from '../InputBox';
import api from '../../api';
const ExpenseForm = () => {
  const [form, setForm] = useState({spenton: '', amount: '',month:'', mode: '', description: '' });
  const addexpense=(formdata)=>{
    return api.post("/addexpense",formdata)
  }
  const submit = async(e) => {
    e.preventDefault();

    try{
      const res = await addexpense({
      spent: form.spenton,
      amount: form.amount,
      mode: form.mode,
      month: form.month,
      description: form.description,
    });
      alert("Submitted Successfully")
      console.log(res.data);
      
    }
    catch(err){
      console.log(err);
      alert("Submittion Failed!")
    }
    setForm({ spenton:'',amount: '',  month:'',  mode: '', description: '' });
    
  };

  return (
    <form onSubmit={submit}>
      <div className='space-y-4 '>
      <InputBox title="Amount" placeholder="Amount spent" value={form.amount}  onChange={e => setForm({...form, amount: e.target.value})}/>
      <InputBox title="SpentOn" placeholder="Where is it spent" value={form.spenton}  onChange={e => setForm({...form,spenton: e.target.value})}/>
      <InputBox title="Month" placeholder="Current Month" value={form.month}  onChange={e => setForm({...form, month: e.target.value})}/>
      <InputBox title="Mode" placeholder="mode of payment cash/HDFC/SBI" value={form.mode}  onChange={e => setForm({...form, mode: e.target.value})}/>
      <div className="col-span-full">
              <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Introduction"
                  value={form.description}
                  onChange={(e) => setForm({...form,description:e.target.value})}
                />
              </div>
            </div>
      </div>
      <button
            type="submit"
            className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Submit
          </button>
    </form>
   
  );
};

export default ExpenseForm;