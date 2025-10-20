'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, Download, AlertCircle } from 'lucide-react';

interface SheetData {
  headers: string[];
  rows: string[][];
  totalRows: number;
  lastUpdated: string;
  sheetId: string;
}

export function SheetsTable() {
  const [data, setData] = useState<SheetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (forceRefresh = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token não encontrado');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sheets${forceRefresh ? '?forceRefresh=true' : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Planilha</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="spinner mr-2" />
            <span>Carregando dados da planilha...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>Não foi possível carregar os dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={() => fetchData(true)} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Planilha</CardTitle>
          <CardDescription>A planilha está vazia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <span>Nenhum dado encontrado na planilha</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Planilha</CardTitle>
            <CardDescription>
              {data.totalRows} linhas • Última atualização: {formatDate(data.lastUpdated)}
            </CardDescription>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header, index) => (
                  <TableHead key={index} className="font-medium">
                    {header || `Coluna ${index + 1}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="font-mono text-sm">
                      {cell || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.rows.length > 10 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Mostrando {data.rows.length} linhas de {data.totalRows} total
          </div>
        )}
      </CardContent>
    </Card>
  );
}
