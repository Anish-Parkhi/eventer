# API documentation

| URL | Method | Body | By | Status | Function  |
| --- | --- | --- | --- | --- | --- |
| /auth/admin/register | POST | clubName, email,  password | Admin | ✅ |  |
| /auth/admin/login | POST | email, password | Admin | ✅ |  |
| /auth/register | POST | email, password | User | ✅ |  |
| /auth/login | POST | email, password | User | ✅ |  |
| /admin/event | POST | eventName, description, venue, clubName, speakerName, extraLink, startDate, endDate, createdBy, | Admin | ✅ |  |
| /event | GET | - | User | ✅ |  |
| /event/:id | GET | - | User | ✅ |  |
| /event/register | POST | eventId | User | ✅ |  |
| /event/registeredEvents | GET | - | User | ✅ |  |
| /admin/events | GET | - | Admin | ✅ | Get all events hosted by a club |
| /admin/:id/regsitrations | GET | -  | Admin |  | Get all registered students |
| /admin/event/:eventId | DELETE | - | Admin |  | Delete particular event hosted by a club |
| /admin/event/:id | PATCH | - | Admin |  | Update info of event |
