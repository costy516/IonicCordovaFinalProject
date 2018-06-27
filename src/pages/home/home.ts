import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import{Storage} from '@ionic/storage';

function resize(arr)
{
  var tempArray1 = new Array(1+arr.length);
  for(var i = 0; i< arr.length; i++)
  {
    tempArray1[i]=arr[i];
  }
  return tempArray1;
}



function addPending(task:Task)
{
  PENDINGTASKS = resize(PENDINGTASKS);
  PENDINGTASKS[PENDINGTASKS.length-1] = task;
}

function addOverdue(task:Task)
{
  OVERDUETASKS = resize(OVERDUETASKS);
  OVERDUETASKS[OVERDUETASKS.length-1] = task;
}


function deletePending(task:Task)
{
  var tempArray3 = new Array(PENDINGTASKS.length-1);
  var counter = 0;
  var hasBeenRemoved = false;
  for(var i = 0; i<PENDINGTASKS.length;i++)
  {
    if(equals(PENDINGTASKS[i],task) && !hasBeenRemoved)
    {
      hasBeenRemoved = true;
    }
    else
    {
      tempArray3[counter++] = PENDINGTASKS[i];
    }
  }
  PENDINGTASKS = tempArray3;
}

function deleteOverdue(task:Task)
{
  var tempArray3 = new Array(OVERDUETASKS.length-1);
  var counter = 0;
  var hasBeenRemoved = false;
  for(var i = 0; i<OVERDUETASKS.length;i++)
  {
    if(equals(OVERDUETASKS[i],task) && !hasBeenRemoved)
    {
      hasBeenRemoved = true;
    }
    else
    {
      tempArray3[counter++] = OVERDUETASKS[i];
    }
  }
  OVERDUETASKS = tempArray3;
}

function equals(that:Task, other:Task)
{
  return (other === undefined)?((that === undefined)?(true):(false)):(that.id === other.id && that.status.localeCompare(other.status)===0 && that.name.localeCompare(other.name)===0);
}

class Task
{
  id:Number;
  status: string;
  name: string;
}

var idCounter= 1;

var PENDINGTASKS = new Array(0);
var OVERDUETASKS = new Array(0);

var TASKS = new Array(0);

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, public storage: Storage){ 
    //this.storage.clear();
    this.storage.ready().then(()=>{
    this.storage.forEach((value, key, iterationNumber) => {
      if(value !== null)
      {
        this.tempTask = new Task;
        this.tempTask.id = iterationNumber;
        this.tempTask.status = value;
        this.tempTask.name = key;
        idCounter = iterationNumber.valueOf();
        console.log("adding");
        if(this.tempTask.status.localeCompare("pending")||this.tempTask.status.localeCompare("completed")||this.tempTask.status.localeCompare("overdue")){
          if(idCounter>=TASKS.length)
        {
          TASKS = resize(TASKS);
        }
        this.tempTask.id = new Number(idCounter);
        TASKS[TASKS.length-1] = this.tempTask;
        if(this.tempTask.status.localeCompare("pending")===0)
        {
          addPending(this.tempTask);
          this.pendingTasks = PENDINGTASKS;
        }
        if(this.tempTask.status.localeCompare("overdue")===0)
        {
          addOverdue(this.tempTask);
          this.overdueTasks = OVERDUETASKS;
        }
        this.tempTask = new Task;
        this.tempTask.name = "name";
        idCounter++;
      }
        this.tasks = TASKS;
        this.pendingTasks = PENDINGTASKS;
        this.overdueTasks = OVERDUETASKS;
        this.tempTask = new Task;
        this.tempTask.name = "name";
      }
    });
});}

  statuses=["pending","completed","overdue"];
 
  tempTask = new Task;
  tasks:Task[];
  pendingTasks = PENDINGTASKS;
  overdueTasks = OVERDUETASKS;

  addTask(): void
  {
    console.log("adding");
    if(idCounter>=TASKS.length)
    {
      TASKS = resize(TASKS);
    }
    this.tempTask.id = new Number(idCounter+1);
    TASKS[TASKS.length-1] = this.tempTask;
    if(this.tempTask.status.localeCompare("pending")===0)
    {
      addPending(this.tempTask);
      this.pendingTasks = PENDINGTASKS;
    }
    if(this.tempTask.status.localeCompare("overdue")===0)
    {
      addOverdue(this.tempTask);
      this.overdueTasks = OVERDUETASKS;
    }
    this.storage.set(this.tempTask.name, this.tempTask.status);
    this.tempTask = new Task;
    this.tempTask.name = "name";
    idCounter++;
    this.tasks = TASKS;
    
  }
  onSelected(type:string):void
  {
    this.tempTask.status = type;
    console.log(type);
  }
  delete(task:Task):void
  {
    console.log("deleting");
    if(task.status.localeCompare("pending")===0)
    {
      deletePending(task);
      this.pendingTasks = PENDINGTASKS;
    }
    if(task.status.localeCompare("overdue")===0)
    {
      deleteOverdue(task);
      this.overdueTasks = OVERDUETASKS;
    }
    var tempArray2 = new Array(TASKS.length-1);
    var hasBeenRemoved = false;
    var counter = 0;
    for(var i = 0; i<TASKS.length; i++)
    {
      if(equals(task, TASKS[i]) && !hasBeenRemoved)
      {
        hasBeenRemoved = true;
      }
      else
      {
        tempArray2[counter++] = TASKS[i];
      }
    }
    TASKS = tempArray2;
    this.tasks = TASKS;
    this.storage.remove(task.name);
  }
}
