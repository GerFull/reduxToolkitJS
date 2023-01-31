import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addNewTodo, fetchTodos } from './store/todoSlice';
import NewTodoForm from './components/NewTodoForm';
import TodoList from './components/TodoList';

import './App.css';
import { useEffect } from 'react';


function App() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { status, error, modal } = useSelector(state => state.todos)

  const handleAction = () => {
    if (text.trim().length) {
      dispatch(addNewTodo(text));
      setText('');
    }
  }

  useEffect(() => {
    dispatch(fetchTodos(['asd', 'asd']))// данный массив отправляется в fulfield поле action.meta.arg
  }, [])

  return (
    <div className='App'>
      <NewTodoForm
        value={text}
        updateText={setText}
        handleAction={handleAction}
      />
      {status === 'loading' && <h1>Loading ...</h1>}
      {error && <div>
        <h1>У тебя такая ошибка: {error.text}</h1>
        <h1>Reducer {error.reducer}</h1></div>}
      <TodoList />
    </div>
  );
}

export default App;
