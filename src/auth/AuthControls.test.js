import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mockAuth = vi.hoisted(() => ({
  user: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn()
}));

vi.mock('./AuthContext.jsx', () => ({
  useAuth: () => mockAuth
}));

import AuthControls from './AuthControls.jsx';

afterEach(() => {
  cleanup();
  document.body.querySelectorAll('.auth-backdrop').forEach((node) => node.remove());
});

beforeEach(() => {
  mockAuth.user = null;
  mockAuth.signIn.mockReset();
  mockAuth.signUp.mockReset();
  mockAuth.signOut.mockReset();
});

describe('AuthControls modal portal', () => {
  it('renders the login dialog outside the filtered site header', () => {
    render(
      React.createElement(
        'header',
        { className: 'site-header' },
        React.createElement(AuthControls)
      )
    );

    fireEvent.click(screen.getByRole('button', { name: /masuk \/ daftar/i }));

    const dialog = screen.getByRole('dialog', { name: /selamat datang kembali/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest('.site-header')).toBeNull();
    expect(document.body.querySelector('.auth-backdrop')).toBeTruthy();
  });

  it('closes the dialog when the backdrop is clicked', () => {
    render(React.createElement(AuthControls));
    fireEvent.click(screen.getByRole('button', { name: /masuk \/ daftar/i }));

    const backdrop = document.body.querySelector('.auth-backdrop');
    expect(backdrop).toBeTruthy();
    fireEvent.mouseDown(backdrop);

    expect(screen.queryByRole('dialog', { name: /selamat datang kembali/i })).toBeNull();
  });
});
