import { screen } from '@testing-library/react'
import { act } from 'react';
import App from "../App"

describe('Apptest', () => {
    it('should render the app properly', async () => {
        await act(async () => {
          global.renderWithRouter(<App />);
        });
        screen.debug();
      });
})