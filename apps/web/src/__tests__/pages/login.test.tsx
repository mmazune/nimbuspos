
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../pages/login';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock useRouter
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('LoginPage', () => {
    const mockLogin = jest.fn();
    const mockPinLogin = jest.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            pinLogin: mockPinLogin,
            loading: false,
            error: null,
        });
        (useRouter as jest.Mock).mockReturnValue({
            query: {},
            push: jest.fn(),
        });
        mockLogin.mockClear();
    });

    it('renders Nimbus POS branding', () => {
        render(<LoginPage />);
        expect(screen.getByText('Nimbus POS')).toBeInTheDocument();
    });

    it('shows environment selector buttons', () => {
        render(<LoginPage />);
        expect(screen.getByText('My Restaurant')).toBeInTheDocument();
        expect(screen.getByText('Demo Environment')).toBeInTheDocument();
    });

    it('defaults to restaurant login (email/pin)', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByText('PIN Login')).toBeInTheDocument();
    });

    it('switches to Demo environment and shows groupings', () => {
        render(<LoginPage />);

        // Switch to Demo
        fireEvent.click(screen.getByText('Demo Environment'));

        // Check for demo groups
        expect(screen.getByText('Individual Restaurant')).toBeInTheDocument(); // Tapas label
        expect(screen.getByText('Franchise Chain')).toBeInTheDocument(); // Cafesserie label

        // Check for a specific user
        const owners = screen.getAllByText('Joshua Owner');
        expect(owners).toHaveLength(2);
    });

    it('clicking a demo user attempts one-tap login', async () => {
        render(<LoginPage />);

        // Switch to Demo
        fireEvent.click(screen.getByText('Demo Environment'));

        // Click on a user (e.g. Tapas Owner)
        // We find the text and click the parent button
        const ownerName = screen.getAllByText('Joshua Owner')[0];
        const ownerButton = ownerName.closest('button');

        fireEvent.click(ownerButton!);

        // Should call login directly
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'owner@tapas.demo.local',
                password: 'Demo#123'
            });
        });
    });
});
