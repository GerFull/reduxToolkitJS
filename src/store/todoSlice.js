import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async (_, { rejectWithValue }) => {

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/?_limit=5')


            if (!response.ok) {
                throw new Error('Server Error')
            }
            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('Server Error')
            }

            dispatch(removeTodo({ id }))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


export const toggleStatus = createAsyncThunk(
    'todos/toggleStatus',
    async (id, { dispatch, rejectWithValue, getState }) => {
        const todo = getState().todos.todos.find(todo => todo.id === id)

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'applitaction/json'
                },
                body: JSON.stringify({
                    completed: !todo.completed
                })
            })
            if (!response.ok) {
                throw new Error('Server Error')
            }

            dispatch(toggleComplete({ id }))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addNewTodo = createAsyncThunk(
    'todos/addNewTodo',
    async (text, { dispatch, rejectWithValue }) => {
        try {
            const todo = {
                title: text,
                userId: 1,
                completed: false
            }
            console.log(text)

            const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'applitaction/json'
                },
                body: JSON.stringify(todo)
            })
            if (!response.ok) {
                throw new Error('Server Error')
            }

            const data = await response.json()


            dispatch(addTodo({
                title: text,
                userId: 1,
                id: data.id,
                completed: false
            }))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const setError = (state, action) => {

    state.status = 'rejected'
    state.error = {
        text: action.payload,
        reducer: action.type
    }
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null,
        modal: null
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push(action.payload);
        },
        toggleComplete(state, action) {
            const toggledTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggledTodo.completed = !toggledTodo.completed;
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        }
    },
    extraReducers: {
        [fetchTodos.pending]: (state) => {
            state.status = 'loading'
            state.error = null
        },
        [fetchTodos.fulfilled]: (state, action) => {
            console.log(action.payload)
            state.status = 'resolved'
            state.todos = action.payload
        },
        [fetchTodos.rejected]: setError,
        [deleteTodo.fulfilled]: (state, action) => {
            state.status = 'resolved'
            state.modal = true
        },
        [deleteTodo.rejected]: setError,
        [toggleStatus.rejected]: setError
    }
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer; 