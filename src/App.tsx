import React, { useState, useEffect } from 'react';
import { z, ZodSchema } from 'zod';
import DynamicForm from './DynamicForm';

const defaultSchema = `
{
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
}
`;

const defaultInitialData = `
{
  name: 'John Doe',
  age: '30',
  address: {
    street: '123 Main St',
    city: 'Anytown',
  },
  hobbies: ['Reading'],
  contacts: [{ type: 'Email', value: 'john.doe@example.com' }],
}
`;

const App = () => {
  const [schemaInput, setSchemaInput] = useState(defaultSchema);
  const [initialDataInput, setInitialDataInput] = useState(defaultInitialData);
  const [formSchema, setFormSchema] = useState<ZodSchema | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedSchema = new Function('z', `return z.object(${schemaInput})`)(z);
      setFormSchema(parsedSchema);
    } catch (error) {
      console.error('Invalid schema:', error);
      setFormSchema(null);
    }
  }, [schemaInput]);

  useEffect(() => {
    if (initialDataInput.trim()) {
      try {
        const parsedData = new Function(`return (${initialDataInput})`)();
        setInitialData(parsedData);
      } catch (error) {
        console.error('Invalid initial data:', error);
        setInitialData(null);
      }
    } else {
      setInitialData(null);
    }
  }, [initialDataInput]);

  const handleSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="flex flex-wrap -mx-2 h-full">
        <div className="w-full md:w-1/2 px-2 mb-4 flex flex-col">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schemaInput">
            Zod Schema
          </label>
          <textarea
            id="schemaInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
            rows={10}
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="initialDataInput">
            Initial Data&nbsp;
            <span className="text-red-500 text-xs italic mt-2">
              Note: Update the initial values to reflect changes in the schema.
            </span>
          </label>
          <textarea
            id="initialDataInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
            rows={10}
            value={initialDataInput}
            onChange={(e) => setInitialDataInput(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          {formSchema && initialData && (
            <DynamicForm key={JSON.stringify(formSchema)} schema={formSchema} initialData={initialData} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;