import { z } from 'zod';
import DynamicForm from './DynamicForm';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
  }),
  hobbies: z.array(z.string().min(1, "Hobby is required")),
  contacts: z.array(z.object({
    type: z.string().min(1, "Contact type is required"),
    value: z.string().min(1, "Contact value is required"),
  })),
});

const initialData = formSchema.parse({
  name: 'John Doe',
  age: '30',
  address: {
    street: '123 Main St',
    city: 'Anytown',
  },
  hobbies: ['Reading'],
  contacts: [{ type: 'Email', value: 'john.doe@example.com' }],
});

const handleSubmit = (data: any) => {
  console.log(data);
  // Handle form submission
};

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <DynamicForm schema={formSchema} initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;