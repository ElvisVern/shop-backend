/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Deliver from 'App/Events/Deliver'

Event.on('notify:diliver_goods', Deliver.deliverNotify)

