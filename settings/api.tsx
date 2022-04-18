import { useEffect, useState, useCallback } from 'react'
import apiFetch from '@wordpress/api-fetch'
// import { Button } from '@wordpress/components'
import './api.scss'

const APP_NAME = 'Custom API Endpoints'
const ACTIONS = {
  HOMEPAGE: { description: 'Bring homepage defined in the Wordpress Settings.' },
  MENUS: { description: 'Bring the menus or menu.' },
}

interface Settings {
  endpoints: any[];
}

export default () => {
    const [passwordCard, setPasswordCard] = useState(null)
    const [applicationPassword, setApplicationPassword] = useState(null)
    const [settings, setSettings] = useState<Settings>({
      endpoints: [
        { path: '', action: '' }
      ]
    })

    const initialize = useCallback(async () => {
      const data = await apiFetch({ path: 'api/settings' }) as Settings
      if (data) {
        setSettings(data)
      }
      if ((window as any).wordpress?.user_application_passwords) {
        const passwords = Object.values(((window as any).wordpress?.user_application_passwords))
        if (passwords.find((password: any) => password.name === APP_NAME)) {
          setApplicationPassword((passwords as any).find((password: any) => password.name === APP_NAME))
        }
      }
    }, [])

    const addEndpoint = () => {
      setSettings({ ...settings, endpoints: [ ...settings?.endpoints, {
        path: '',
      } ] })
    }

    const generatePassword = async (user_id: string) => {
      const data = await apiFetch( {
        path: `/wp/v2/users/${user_id}/application-passwords`,
        method: 'POST',
        data: { name: APP_NAME },
        credentials: 'include'
      })
      return data
    }

    const revokePassword = async () => {
      const { deleted } = await apiFetch( {
        path: `/wp/v2/users/1/application-passwords/${(applicationPassword as any).uuid}`,
        method: 'DELETE',
        credentials: 'include'
      })
      return deleted
    }

    useEffect(() => {
      initialize()
    }, [])
    
    return (<>
      <div className='container'>
        {passwordCard && <p className='lead mt-3'>Your password for this application is: <kbd>{ (passwordCard as any).password }</kbd><br/>Be sure to save this in a safe location. You will not be able to retrieve it.</p>}
        <div className='row mt-3 mb-3'>
          <div className='col'>
            {!applicationPassword ? <a onClick={async ()=> {
              const data = await generatePassword((window as any)?.wordpress?.current_user_id)
              setApplicationPassword((data as any))
              setPasswordCard((data as any))
            }} className='btn btn-primary btn-sm'>Generate Application Password</a> : <a onClick={async ()=> {
              const deleted = await revokePassword()
              if (deleted) {
                const data = await generatePassword((window as any)?.wordpress?.current_user_id)
                setApplicationPassword((data as any))
                setPasswordCard((data as any))
              }
            }} className='btn btn-primary btn-sm'>Regenerate Application Password</a>}
          </div>
        </div>
        {settings?.endpoints.map(({ url }, key) => <div key={key} className='d-flex flex-row justify-content-start align-items-center mb-2'>
          <div className='input-group'>
            <span className='input-group-text' id={`path-${key}`}>{window.location.origin}/wp-json/api/</span>
            <input type='text' className='form-control' id={`path-${key}`} aria-describedby={`path-${key}`} autoComplete='off' name={`API_settings[endpoints][${key}][url]`} value={ url } onChange={(e) => {
              const endpoints = settings?.endpoints.slice()
              endpoints.splice(key, 1, e.target.value)
              setSettings({ ...settings, endpoints })
            }} />
          </div>
          <div className='ms-5'>
            <div className='btn-group dropdown'>
              <button type='button' className='btn btn-secondary btn-sm dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>Action</button>
              <ul className='dropdown-menu'>
                <li><button className='dropdown-item' type='button'>Action</button></li>
                <li><button className='dropdown-item' type='button'>Another action</button></li>
                <li><button className='dropdown-item' type='button'>Something else here</button></li>
              </ul>
            </div>
            <a className='btn btn-danger btn-sm ms-1' onClick={() => {
              const endpoints = settings?.endpoints.slice()
              endpoints.splice(key, 1)
              setSettings({ ...settings, endpoints })
            }}>
              <i className='bi bi-trash-fill'></i>
            </a>
          </div>
        </div>)}
      </div>
      {/* <input type='text' id='API_settings[api_settings_apikey]' autoComplete='off' name='API_settings[api_settings_apikey]' value={ 'settings.api_settings_apikey' } /> */}
      {/* <table className='form-table' role='presentation'>
        <tbody> */}
          
          {/* <Button onClick={addEndpoint} variant='primary' icon='plus' className='button button-primary'>Add Endpoint</Button> */}
          
          {/* <tr className='d-flex flex-row'>
            <th scope='row'>
              <label htmlFor='workable_apikey'>Workable API Key</label>
            </th>
            <td>
              <input type='text' id='workable_apikey' autocomplete='off' name='workable_settings[workable_apikey]' value={ settings.workable_apikey } onChange={(e) => {setSettings({...settings, workable_apikey: e.target.value })}} />
              <p className='description'>Here's a document where you can generate this API Key <a href='https://workable.readme.io/docs/generate-an-access-token#generate-an-api-access-token' target='_blank'>Generate an API access token</a>.</p>
            </td>
          </tr>
          <tr className='d-flex flex-row'>
            <th scope='row'>
              <label htmlFor='workable_domain'>Workable Domain</label>
            </th>
            <td>
              <input type='text' id='workable_domain' autocomplete='off' name='workable_settings[workable_domain]' value={ settings.workable_domain } onChange={(e) => {setSettings({...settings, workable_domain: e.target.value })}} />
              <p className='description'>This is the subdomain tha that appears in the workable url's before <kbd>&lt;subdomain&gt;.workable.com</kbd>.</p>
            </td>
          </tr> */}
        {/* </tbody>
      </table> */}
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <div className='d-flex justify-content-end'>
              <button type='button' className='btn btn-link btn-sm' onClick={addEndpoint}>
                <i className='bi bi-plus'></i> New Endpoint
              </button>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <input type='submit' className='btn btn-primary btn-sm' value='Save Settings' />
            </div>
          </div>
        </div>
      </div>
    </>)
}
