import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';

import { createStore } from './createStore';

interface IGlobalStore {
  user: IUser | null;
  todos: ITodo[];
  login(): void;
  logout(): void;
  addTodo(title: string, author?: string): void;
  toggleTodoDone(todoId: number): void;
  removeTodo(todoId: number): void;
}

const useGlobalStore = createStore<IGlobalStore>((setState, getState) => ({
  todos: [],
  user: null,
  login: () => setState({ user: { name: 'John', email: 'jonh@mail.com' } }),
  logout: () => setState({ user: null }),
  addTodo: (title: string) =>
    setState((prevState) => ({
      todos: prevState.todos.concat({
        id: Date.now(),
        title,
        author: getState().user?.name ?? 'Convidado',
        done: false,
      }),
    })),
  toggleTodoDone: (todoId: number) =>
    setState({
      todos: getState().todos.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo,
      ),
    }),
  removeTodo: (todoId: number) => {
    setState({
      todos: getState().todos.filter((todo) => todo.id !== todoId),
    });
  },
}));

export { useGlobalStore };
