import React, { useState ,useEffect} from 'react'
import style from '../component/module.css'
import image from '../component/image.png';
import Axios from 'axios'
export default function ToDoList(props) {


  const [state,setState] =useState({
    taskList:[],
    values:{
      taskName:''
    },
    errors:{
      taskName:''
    }
  });

   const handleChange = (e) => {
      let {value , name} =e.target;
      console.log(value,name);
      let newValues ={...state.values};
      newValues = {...newValues,[name]:value};
      let newErrors = {...state.errors};

      let regexString = /^[a-z A-Z]+$/;

      if(!regexString.test(value)  || value.trim() === ''){
        newErrors[name] = name + 'invalid !';
      }else{
        newErrors[name] = '';
      }
      setState({
        ...state,
        values : newValues,
        errors : newErrors
      })
    }

    const getTaskList = () => {
      let promise = Axios({
        url:'http://svcy.myclass.vn/api/ToDoList/GetAllTask',
        method:'GET'
      });
      promise.then((result)=>{
        console.log(result.data);
        
        setState({
          ...state,
          taskList: result.data
        })
        console.log('thanh cong')
      });
      promise.catch((err)=>{
        console.log('that bai')
        console.log(err.response.data)
      });
    }

   const  addTask = (e) => {
      e.preventDefault();
      console.log(state.values.taskName);
      let promise = Axios({
        url:'http://svcy.myclass.vn/api/ToDoList/AddTask',
        method:'POST',
        data: {taskName : state.values.taskName}
      });
      promise.then(result => {
        getTaskList();
      })
      promise.catch(errors => {
        alert(errors.response.data)
      })
    }

    useEffect(() => {
      getTaskList();
      return () => { }
    }, [])

    const rejectTask = (taskName) => {
      let promise = Axios({
        url:`http://svcy.myclass.vn/api/ToDoList/rejectTask?taskName=${taskName}`,
        method:'PUT'
      });
      promise.then(res=>{
        alert(res.data);
        getTaskList();
      });
      promise.catch(err=>{
        alert(err.response.data)
      })
    }


    const checkTask = (taskName) => {
      let promise = Axios({
        url:`http://svcy.myclass.vn/api/ToDoList/doneTask?taskName=${taskName}`,
        method:'PUT'
      });
      promise.then(res=>{
        alert(res.data);
        getTaskList();
      })
      promise.catch(err=>{
        alert(err.response.data);
      })
    }

    const delTask = (taskName) => {
      let promise = Axios({
        url:`http://svcy.myclass.vn/api/ToDoList/deleteTask?taskName=${taskName}`,
        method:'delete',
      });
      promise.then(res=>{
        alert(res.data);
        getTaskList();
      });
      promise.catch(err=>{
        alert(err.response.data)
      })
    }


  const renderTaskToDo= () => {
      return state.taskList.filter(item => !item.status).map((item,index)=>{
        return <li key={index}> 
                  <span>
                    {item.taskName}
                  </span>
                  <div className="buttons">
                    <button className="remove" type="button" onClick={()=>{delTask(item.taskName)}}>
                      <i className="fa fa-trash-alt"/>
                    </button>
                    <button type="button" className="complete" onClick={()=>{checkTask(item.taskName)}}>
                      <i className="far fa-check-circle"/>
                      <i className="fas fa-check-circle"/>
                    </button>
                  </div>
                </li>
      })
    }

   const renderTaskToDone = () => {
      return state.taskList.filter(item => item.status).map((item,index)=>{
        return <li key={index}>
                  <span>
                    {item.taskName}
                  </span>
                  <div className="buttons">
                    <button  className="remove" type="button" onClick={()=>{delTask(item.taskName)}}>
                      <i className="fa fa-trash-alt"/>
                    </button>
                    <button type="button" className="complete" onClick={() => {rejectTask(item.taskName)}}>
                      <i className="fa fa-undo"/>
                    </button>
                  </div>
        </li>
      })
    }


    return (
        <div className="card">
  <div className="card__header">
    <img src={image} />
  </div>
  <form className="card__body" onSubmit={addTask}>
    <div className="card__content">
      <div className="card__title">
        <h2>Hoạt động của tôi</h2>
        <p>March 7 ,2021</p>
      </div>
      <div className="card__add">
        <input id="newTask" type="text" name="taskName" placeholder="Thêm hoạt động" onChange={handleChange} />
        <button id="addItem" type="submit" onClick={addTask}>
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className="card__todo">
        <ul className="todo" id="todo">
          {renderTaskToDo()}
        </ul>
        <ul className="todo" id="completed">
          {renderTaskToDone()}
        </ul>
      </div>
    </div>
  </form>
</div>

    )
}
