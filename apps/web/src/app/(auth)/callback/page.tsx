'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const errorMessage = searchParams.get('message');

    if (error || errorMessage) {
      setStatus('error');
      setMessage(errorMessage || 'Erro na autenticação');
      return;
    }

    if (token) {
      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      setStatus('success');
      setMessage('Login realizado com sucesso! Redirecionando...');
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setStatus('error');
      setMessage('Token não encontrado');
    }
  }, [searchParams, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="spinner mx-auto" />
              <p className="text-muted-foreground">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Tentar novamente
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
