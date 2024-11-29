import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../app/login/page'; // Certifique-se de que o caminho para o componente está correto

describe('Login Page', () => {
  it('should render the page without crashing', () => {
    render(<Page />);

    // Verifique se o texto "Acessar" aparece na página
    const heading = screen.getByText(/Acessar/i);
    expect(heading).toBeInTheDocument();

    // Verifique outro texto existente, se necessário
    const subheading = screen.getByText(/Entre com seu email e senha/i);
    expect(subheading).toBeInTheDocument();
  });
});
