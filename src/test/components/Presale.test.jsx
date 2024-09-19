// src/components/Presale.test.jsx
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Presale from '../../components/Presale';
import usePresaleStore from '../../store/usePresaleStore';
import { pactCalls, buyTokensSale } from '../../pactcalls/kadena';
import { toast } from 'react-toastify';

describe('Presale Component', () => {
  beforeEach(() => {
    usePresaleStore.setState({
      balance: 100,
      phase0startTime: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      phase1startTime: new Date(Date.now() + 7200 * 1000), // 2 hours from now
      salesEndTime: new Date(Date.now() + 10800 * 1000), // 3 hours from now
      isWhitelisted: true,
      p0Reserved: 5,
      amountPerBatch: 10,
      currentPrice: 2,
      kdaInput: 0,
      batchCount: 0,
      tokenSymbol: 'MOCK',
      salesAccount: 'mockSalesAccount',
      availableBatches: 10,
      supplyChain: '1',
    });
  });

     it('should load the presale component', () => {
       global.renderWithRouter(<Presale />);
       screen.debug()
     })

// //   // it('should render the Presale component and display initial content', async () => {
// //   //   await act(async () => {
// //   //     global.renderWithRouter(<Presale />);
// //   //   });

// //   //   screen.debug();

// //   //   const presaleTitle = screen.getByText((content, element) => {
// //   //     return content.includes('MOCK Presale');
// //   //   });
// //   //   expect(presaleTitle).toBeInTheDocument();

// //   //   expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
// //   // });

// //   // it('should calculate and display countdown correctly', async () => {
// //   //   await act(async () => {
// //   //     renderWithRouter(<Presale />);
// //   //   });

// //   //   await waitFor(() => {
// //   //     expect(screen.getByText(/White Listed Presale is Live/i)).toBeInTheDocument();
// //   //   });
    
// //   //   const countdownText = screen.getByText(/d :/i).textContent;
// //   //   expect(countdownText).toMatch(/\d{1,2}d : \d{1,2}h : \d{1,2}m : \d{1,2}s/);
// //   // });

// //   // it('should handle successful buy action', async () => {
// //   //   const mockBuyResponse = {
// //   //     preflightResult: {
// //   //       reqKey: 'mockReqKey',
// //   //       result: { status: 'success', data: 'Purchase successful' },
// //   //     },
// //   //   };

// //   //   buyTokensSale.mockResolvedValueOnce(mockBuyResponse);

// //   //   await act(async () => {
// //   //     renderWithRouter(<Presale />);
// //   //   });

// //   //   usePresaleStore.setState({
// //   //     batchCount: 2,
// //   //     kdaInput: 4,
// //   //   });

// //   //   fireEvent.click(screen.getByText(/Buy/i));

// //   //   await waitFor(() => {
// //   //     expect(buyTokensSale).toHaveBeenCalled();
// //   //     expect(screen.getByText(/Transaction Hash: mockReqKey/i)).toBeInTheDocument();
// //   //     expect(toast.success).toHaveBeenCalledWith('Success: Purchase successful', { position: 'top-center' });
// //   //   });
// //   // });

// //   // it('should handle failed buy action', async () => {
// //   //   const mockErrorResponse = {
// //   //     preflightResult: {
// //   //       reqKey: '',
// //   //       result: { status: 'failure', error: { message: 'Purchase failed' } },
// //   //     },
// //   //   };

// //   //   buyTokensSale.mockResolvedValueOnce(mockErrorResponse);

// //   //   await act(async () => {
// //   //     renderWithRouter(<Presale />);
// //   //   });

// //   //   usePresaleStore.setState({
// //   //     batchCount: 2,
// //   //     kdaInput: 4,
// //   //   });

// //   //   fireEvent.click(screen.getByText(/Buy/i));

// //   //   await waitFor(() => {
// //   //     expect(buyTokensSale).toHaveBeenCalled();
// //   //     expect(toast.error).toHaveBeenCalledWith('Error: Purchase failed');
// //   //   });
// //   // });

// //   // it('should prevent buying if KDA input is greater than balance', async () => {
// //   //   await act(async () => {
// //   //     renderWithRouter(<Presale />);
// //   //   });

// //   //   usePresaleStore.setState({
// //   //     batchCount: 100,
// //   //     kdaInput: 1000,
// //   //   });

// //   //   fireEvent.click(screen.getByText(/Buy/i));

// //   //   await waitFor(() => {
// //   //     expect(screen.getByText(/Insufficient balance on Chain/i)).toBeInTheDocument();
// //   //     expect(screen.queryByText(/Transaction Hash/i)).not.toBeInTheDocument();
// //   //   });
// //   // });

// //   // it('should copy contract address to clipboard', async () => {
// //   //   await act(async () => {
// //   //     renderWithRouter(<Presale />);
// //   //   });

// //   //   const copyButton = screen.getByRole('button', { name: /Copy Icon/i });
// //   //   fireEvent.click(copyButton);

// //   //   expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${NS}.${MODULE_NAME}`);
// //   //   expect(toast.success).toHaveBeenCalledWith('Contract address copied to clipboard', expect.any(Object));
// //   // });
});
