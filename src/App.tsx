import DynamicForm from './DynamicForm';

const App = () => {
  const initialData = {
    name: '',
    age: '',
    address: {
      street: '',
      city: '',
    },
    hobbies: [''],
    contacts: [{ type: '', value: '' }],
  };

  const handleSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="container mx-auto p-4">
      <DynamicForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;