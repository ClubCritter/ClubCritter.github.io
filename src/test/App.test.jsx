import { render, screen } from '@testing-library/react'
import App from "../App"

describe('Apptest', () => {
    it('should render the app properly', () => {
        render(<App />)
        screen.debug()
    })
})