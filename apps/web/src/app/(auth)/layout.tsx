import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            msgSYSTEC
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Planilhas
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}
