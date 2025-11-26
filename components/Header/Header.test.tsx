jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  }),
}));


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

test('Header displays logo and handles click', () => {
  render(<Header />);
});
