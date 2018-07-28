import Leaflet from 'leaflet'
import React from 'react'

import SimpleExample from './simple'

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/'

const App = () => (
  <div>
    <SimpleExample />
  </div>
)

export default App
