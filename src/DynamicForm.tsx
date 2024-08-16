import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Helper function to create a dynamic Zod schema
const createDynamicSchema = (obj: any): z.ZodTypeAny => {
  if (Array.isArray(obj)) {
    return z.array(createDynamicSchema(obj[0]));
  } else if (typeof obj === 'object' && obj !== null) {
    const shape: { [key: string]: z.ZodTypeAny } = {};
    for (const [key, value] of Object.entries(obj)) {
      shape[key] = createDynamicSchema(value);
    }
    return z.object(shape);
  } else {
    return z.any();
  }
};

interface DynamicFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    schema: z.ZodTypeAny;
  }
  
  const DynamicForm: React.FC<DynamicFormProps> = ({ initialData, onSubmit, schema }) => {
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData,
      });
  
    const renderField = (fieldName: string, fieldValue: any, path = '') => {
      const fullPath = path ? `${path}.${fieldName}` : fieldName;
  
      if (Array.isArray(fieldValue)) {
        return (
          <ArrayField
            control={control}
            name={fullPath}
            defaultValue={fieldValue}
          />
        );
      } else if (typeof fieldValue === 'object' && fieldValue !== null) {
        return (
          <ObjectField
            control={control}
            name={fullPath}
            defaultValue={fieldValue}
          />
        );
      } else {
        return (
          <Controller
            name={fullPath}
            control={control}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
          />
        );
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dynamic Form</h2>
        {Object.entries(initialData).map(([fieldName, fieldValue]) => (
          <div key={fieldName} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {fieldName}
            </label>
            {renderField(fieldName, fieldValue)}
            {errors[fieldName] && (
              <p className="text-red-500 text-xs italic mt-1">
                {(errors[fieldName] as any)?.message}
              </p>
            )}
          </div>
        ))}
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    );
  };
  
  const ObjectField: React.FC<{ control: any; name: string; defaultValue: object }> = ({ control, name, defaultValue }) => {
    return (
      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
        {Object.entries(defaultValue).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {key}
            </label>
            <Controller
              name={`${name}.${key}`}
              control={control}
              render={({ field }) => {
                if (typeof value === 'object' && value !== null) {
                  return <ObjectField control={control} name={`${name}.${key}`} defaultValue={value} />;
                } else if (Array.isArray(value)) {
                  return <ArrayField control={control} name={`${name}.${key}`} defaultValue={value} />;
                } else {
                  return <input {...field} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />;
                }
              }}
            />
          </div>
        ))}
      </div>
    );
  };
  
  const ArrayField: React.FC<{ control: any; name: string; defaultValue: any[] }> = ({ control, name, defaultValue }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name,
    });
  
    return (
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={`${name}.${index}`}
              control={control}
              render={({ field }) => {
                if (typeof defaultValue[0] === 'object' && defaultValue[0] !== null) {
                  return <ObjectField control={control} name={`${name}.${index}`} defaultValue={defaultValue[0]} />;
                } else {
                  return <input {...field} className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />;
                }
              }}
            />
            <button 
              type="button" 
              onClick={() => remove(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => append(Array.isArray(defaultValue[0]) ? [] : typeof defaultValue[0] === 'object' ? {} : '')}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Item
        </button>
      </div>
    );
  };
  
  export default DynamicForm;