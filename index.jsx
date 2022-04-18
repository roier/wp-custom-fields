import 'bootstrap';
import { render } from '@wordpress/element'

import APISettings from './settings/api'
  
if (document.getElementById('API-Settings')) {
    render(<APISettings />, document.getElementById('API-Settings'))
}

export default {}