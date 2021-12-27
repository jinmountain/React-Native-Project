const timezones = [
  { 
  	timezone: "Pacific/Niue",
  	gmt: "(GMT-11:00) Niue",
  	offset: 660
  },
  {
  	timezone: "Pacific/Pago_Pago",
  	gmt: "(GMT-11:00) Pago Pago",
  	offset: 660
  },
  {
  	timezone: "Pacific/Honolulu",
  	gmt: "(GMT-10:00) Hawaii Time",
  	offset: 600
  },
  {
  	timezone: "Pacific/Rarotonga",
  	gmt: "(GMT-10:00) Rarotonga",
  	offset: 600
  },
  {
  	timezone: "Pacific/Tahiti", 
  	gmt: "(GMT-10:00) Tahiti",
  	offset: 600
  },
  {
  	timezone: "Pacific/Marquesas", 
  	gmt: "(GMT-09:30) Marquesas",
  	offset: 570
  },
  {
  	timezone: "America/Anchorage", 
  	gmt: "(GMT-09:00) Alaska Time",
  	offset: 540
  },
  {
  	timezone: "Pacific/Gambier",
  	gmt: "(GMT-09:00) Gambier",
  	offset: 540
  },
  {
  	timezone: "America/Los_Angeles", 
  	gmt: "(GMT-08:00) Pacific Time",
  	offset: 480
  },
  {
  	timezone: "America/Tijuana", 
  	gmt: "(GMT-08:00) Pacific Time - Tijuana",
  	offset: 480
  },
  {
  	timezone: "America/Vancouver", 
  	gmt: "(GMT-08:00) Pacific Time - Vancouver",
  	offset: 480
  },
  {
  	timezone: "America/Whitehorse",
  	gmt: "(GMT-08:00) Pacific Time - Whitehorse",
  	offset: 480
  },
  {
  	timezone: "Pacific/Pitcairn", 
  	gmt: "(GMT-08:00) Pitcairn",
  	offset: 480
  },
  {
  	timezone: "America/Dawson_Creek", 
  	gmt: "(GMT-07:00) Mountain Time - Dawson Creek",
  	offset: 420
  },
  {
  	timezone: "America/Denver",
  	gmt: "(GMT-07:00) Mountain Time",
  	offset: 420
  },
  {
  	timezone: "America/Edmonton",
  	gmt: "(GMT-07:00) Mountain Time - Edmonton",
  	offset: 420
  },
  {
  	timezone: "America/Hermosillo", 
  	gmt: "(GMT-07:00) Mountain Time - Hermosillo",
  	offset: 420
  },
  {
  	timezone: "America/Mazatlan", 
  	gmt: "(GMT-07:00) Mountain Time - Chihuahua, Mazatlan",
  	offset: 420
  },
  {
  	timezone: "America/Phoenix",
  	gmt: "(GMT-07:00) Mountain Time - Arizona",
  	offset: 420,
  },
  {
  	timezone: "America/Yellowknife", 
  	gmt: "(GMT-07:00) Mountain Time - Yellowknife",
  	offset: 420
  },
  {
  	timezone: "America/Belize",
  	gmt: "(GMT-06:00) Belize",
  	offset: 360
  },
  {
  	timezone: "America/Chicago", 
  	gmt: "(GMT-06:00) Central Time",
  	offset: 360
  },
  {
  	timezone: "America/Costa_Rica",
  	gmt: "(GMT-06:00) Costa Rica",
  	offset: 360
  },
  {
  	timezone: "America/El_Salvador",
  	gmt : "(GMT-06:00) El Salvador",
  	offset: 360
  },
  {
  	timezone: "America/Guatemala",
  	gmt: "(GMT-06:00) Guatemala",
  	offset: 360,
  },
  {
  	timezone: "America/Managua",
  	gmt: "(GMT-06:00) Managua",
  	offset: 360,
  },
  {
  	timezone: "America/Mexico_City",
  	gmt: "(GMT-06:00) Central Time - Mexico City",
  	offset: 360,
  },
  {
  	timezone: "America/Regina",
  	gmt: "(GMT-06:00) Central Time - Regina",
  	offset: 360,
  },
  {
  	timezone: "America/Tegucigalpa",
  	gmt: "(GMT-06:00) Central Time - Tegucigalpa",
  	offset: 360
  },
  {
  	timezone: "America/Winnipeg",
  	gmt: "(GMT-06:00) Central Time - Winnipeg",
  	offset: 360
  },
  { 
  	timezone: "Pacific/Galapagos",
  	gmt: "(GMT-06:00) Galapagos",
  	offset: 360
  },
  { 
  	timezone: "America/Bogota",
  	gmt: "(GMT-05:00) Bogota",
  	offset: 300
  },
  { 
  	timezone: "America/Cancun",
  	gmt: "(GMT-05:00) America Cancun",
  	offset: 300
  },
  { 
  	timezone: "America/Cayman",
  	gmt: "(GMT-05:00) Cayman",
  	offset: 300
  },
  { 
  	timezone: "America/Guayaquil",
  	gmt: "(GMT-05:00) Guayaquil",
  	offset: 300
  },
  { 
  	timezone: "America/Havana",
  	gmt: "(GMT-05:00) Havana",
  	offset: 300
  },
  { 
  	timezone: "America/Iqaluit",
  	gmt: "(GMT-05:00) Eastern Time - Iqaluit",
  	offset: 300
  },
  { 
  	timezone: "America/Jamaica",
  	gmt: "(GMT-05:00) Jamaica",
  	offset: 300
  },
  { 
  	timezone: "America/Lima",
  	gmt: "(GMT-05:00) Lima",
  	offset: 300
  },
  { 
  	timezone: "America/Nassau",
  	gmt: "(GMT-05:00) Nassau",
  	offset: 300
  },
  { 
  	timezone: "America/New_York",
  	gmt: "(GMT-05:00) Eastern Time",
  	offset: 300
  },
  { 
  	timezone: "America/Panama",
  	gmt: "(GMT-05:00) Panama",
  	offset: 300
  },
  { 
  	timezone: "America/Port-au-Prince",
  	gmt: "(GMT-05:00) Port-au-Prince",
  	offset: 300
  },
  { 
  	timezone: "America/Rio_Branco",
  	gmt: "(GMT-05:00) Rio Branco",
  	offset: 300
  },
  { 
  	timezone: "America/Toronto",
  	gmt: "(GMT-05:00) Eastern Time - Toronto",
  	offset: 300
  },
  { 
  	timezone: "Pacific/Easter",
  	gmt: "(GMT-05:00) Easter Island",
  	offset: 300
  },
  { 
  	timezone: "America/Caracas",
  	gmt: "(GMT-04:30) Caracas",
  	offset: 270
  },
  { 
  	timezone: "America/Asuncion",
  	gmt: "(GMT-03:00) Asuncion",
  	offset: 180
  },
  { 
  	timezone: "America/Barbados",
  	gmt: "(GMT-04:00) Barbados",
  	offset: 240
  },
  { 
  	timezone: "America/Boa_Vista",
  	gmt: "(GMT-04:00) Boa Vista",
  	offset: 240
  },
  { 
  	timezone: "America/Campo_Grande",
  	gmt: "(GMT-03:00) Campo Grande",
  	offset: 180
  },
  { 
  	timezone: "America/Cuiaba",
  	gmt: "(GMT-03:00) Cuiaba",
  	offset: 180
  },
  { 
  	timezone: "America/Curacao",
  	gmt: "(GMT-04:00) Curacao",
  	offset: 240
  },
  { 
  	timezone: "America/Grand_Turk",
  	gmt: "(GMT-04:00) Grand Turk",
  	offset: 240
  },
  { 
  	timezone: "America/Guyana",
  	gmt: "(GMT-04:00) Guyana",
  	offset: 240
  },
  { 
  	timezone: "America/Halifax",
  	gmt: "(GMT-04:00) Atlantic Time - Halifax",
  	offset: 240
  },
  { 
  	timezone: "America/La_Paz",
  	gmt: "(GMT-04:00) La Paz",
  	offset: 240
  },
  { 
  	timezone: "America/Manaus",
  	gmt: "(GMT-04:00) Manaus",
  	offset: 240
  },
  { 
  	timezone: "America/Martinique",
  	gmt: "(GMT-04:00) Martinique",
  	offset: 240
  },
  { 
  	timezone: "America/Port_of_Spain",
  	gmt: "(GMT-04:00) Port of Spain",
  	offset: 240
  },
  { 
  	timezone: "America/Porto_Velho",
  	gmt: "(GMT-04:00) Porto Velho",
  	offset: 240
  },
  { 
  	timezone: "America/Puerto_Rico",
  	gmt: "(GMT-04:00) Puerto Rico",
  	offset: 240
  },
  { 
  	timezone: "America/Santo_Domingo",
  	gmt: "(GMT-04:00) Santo Domingo",
  	offset: 240
  },
  { 
  	timezone: "America/Thule",
  	gmt: "(GMT-04:00) Thule",
  	offset: 240
  },
  { 
  	timezone: "Atlantic/Bermuda",
  	gmt: "(GMT-04:00) Bermuda",
  	offset: 240
  },
  { 
  	timezone: "America/St_Johns",
  	gmt: "(GMT-03:30) Newfoundland Time - St. Johns",
  	offset: 210
  },
  { 
  	timezone: "America/Araguaina",
  	gmt: "(GMT-03:00) Araguaina",
  	offset: 180
  },
  { 
  	timezone: "America/Argentina/Buenos_Aires",
  	gmt: "(GMT-03:00) Buenos Aires",
  	offset: 180
  },
  { 
  	timezone: "America/Bahia",
  	gmt: "(GMT-03:00) Salvador",
  	offset: 180
  },
  { 
  	timezone: "America/Belem",
  	gmt: "(GMT-03:00) Belem",
  	offset: 180
  },
  { 
  	timezone: "America/Cayenne",
  	gmt: "(GMT-03:00) Cayenne",
  	offset: 180
  },
  { 
  	timezone: "America/Fortaleza",
  	gmt: "(GMT-03:00) Fortaleza",
  	offset: 180
  },
  { 
  	timezone: "America/Godthab",
  	gmt: "(GMT-03:00) Godthab",
  	offset: 180
  },
  { 
  	timezone: "America/Maceio",
  	gmt: "(GMT-03:00) Maceio",
  	offset: 180
  },
  { 
  	timezone: "America/Miquelon",
  	gmt: "(GMT-03:00) Miquelon",
  	offset: 180
  },
  { 
  	timezone: "America/Montevideo",
  	gmt: "(GMT-03:00) Montevideo",
  	offset: 180
  },
  { 
  	timezone: "America/Paramaribo",
  	gmt: "(GMT-03:00) Paramaribo",
  	offset: 180
  },
  { 
  	timezone: "America/Recife",
  	gmt: "(GMT-03:00) Recife",
  	offset: 180
  },
  { 
  	timezone: "America/Santiago",
  	gmt: "(GMT-03:00) Santiago",
  	offset: 180
  },
  { 
  	timezone: "America/Sao_Paulo",
  	gmt: "(GMT-02:00) Sao Paulo",
  	offset: 120
  },
  { 
  	timezone: "Antarctica/Palmer",
  	gmt: "(GMT-03:00) Palmer",
  	offset: 180
  },
  { 
  	timezone: "Antarctica/Rothera",
  	gmt: "(GMT-03:00) Rothera",
  	offset: 180
  },
  { 
  	timezone: "Atlantic/Stanley",
  	gmt: "(GMT-03:00) Stanley",
  	offset: 180
  },
  { 
  	timezone: "America/Noronha",
  	gmt: "(GMT-02:00) Noronha",
  	offset: 120
  },
  { 
  	timezone: "Atlantic/South_Georgia",
  	gmt: "(GMT-02:00) South Georgia",
  	offset: 120
  },
  { 
  	timezone: "America/Scoresbysund",
  	gmt: "(GMT-01:00) Scoresbysund",
  	offset: 60
  },
  { 
  	timezone: "Atlantic/Azores",
  	gmt: "(GMT-01:00) Azores",
  	offset: 60
  },
  { 
  	timezone: "Atlantic/Cape_Verde",
  	gmt: "(GMT-01:00) Cape Verde",
  	offset: 60
  },
  { 
  	timezone: "Africa/Abidjan",
  	gmt: "(GMT+00:00) Abidjan",
  	offset: 0
  },
  { 
  	timezone: "Africa/Accra",
  	gmt: "(GMT+00:00) Accra",
  	offset: 0
  },
  { 
  	timezone: "Africa/Bissau",
  	gmt: "(GMT+00:00) Bissau",
  	offset: 0
  },
  { 
  	timezone: "Africa/Casablanca",
  	gmt: "(GMT+00:00) Casablanca",
  	offset: 0
  },
  { 
  	timezone: "Africa/El_Aaiun",
  	gmt: "(GMT+00:00) El Aaiun",
  	offset: 0
  },
  { 
  	timezone: "Africa/Monrovia",
  	gmt: "(GMT+00:00) Monrovia",
  	offset: 0
  },
  { 
  	timezone: "America/Danmarkshavn",
  	gmt: "(GMT+00:00) Danmarkshavn",
  	offset: 0
  },
  { 
  	timezone: "Atlantic/Canary",
  	gmt: "(GMT+00:00) Canary Islands",
  	offset: 0
  },
  { 
  	timezone: "Atlantic/Faroe",
  	gmt: "(GMT+00:00) Faeroe",
  	offset: 0
  },
  { 
  	timezone: "Atlantic/Reykjavik",
  	gmt: "(GMT+00:00) Reykjavik",
  	offset: 0
  },
  { 
  	timezone: "Etc/GMT",
  	gmt: "(GMT+00:00) GMT (no daylight saving)",
  	offset: 0
  },
  { 
  	timezone: "Europe/Dublin",
  	gmt: "(GMT+00:00) Dublin",
  	offset: 0
  },
  { 
  	timezone: "Europe/Lisbon",
  	gmt: "(GMT+00:00) Lisbon",
  	offset: 0
  },
  { 
  	timezone: "Europe/London",
  	gmt: "(GMT+00:00) London",
  	offset: 0
  },
  { 
  	timezone: "Africa/Algiers",
  	gmt: "(GMT+01:00) Algiers",
  	offset: 0
  },
  { 
  	timezone: "Africa/Ceuta",
  	gmt: "(GMT+01:00) Ceuta",
  	offset: 0
  },
  { 
  	timezone: "Africa/Lagos",
  	gmt: "(GMT+01:00) Lagos",
  	offset: 0
  },
  { 
  	timezone: "Africa/Ndjamena",
  	gmt: "(GMT+01:00) Ndjamena",
  	offset: 0
  },
  { 
  	timezone: "Africa/Tunis",
  	gmt: "(GMT+01:00) Tunis",
  	offset: 0
  },
  { 
  	timezone: "Africa/Windhoek",
  	gmt: "(GMT+02:00) Windhoek",
  	offset: -120
  },
  { 
  	timezone: "Europe/Amsterdam",
  	gmt: "(GMT+01:00) Amsterdam",
  	offset: -60
  },
  { 
  	timezone: "Europe/Andorra",
  	gmt: "(GMT+01:00) Andorra",
  	offset: -60
  },
  { 
  	timezone: "Europe/Belgrade",
  	gmt: "(GMT+01:00) Central European Time - Belgrade",
  	offset: -60
  },
  { 
  	timezone: "Europe/Berlin",
  	gmt: "(GMT+01:00) Berlin",
  	offset: -60
  },
  { 
  	timezone: "Europe/Brussels",
  	gmt: "(GMT+01:00) Brussels",
  	offset: -60
  },
  { 
  	timezone: "Europe/Budapest",
  	gmt: "(GMT+01:00) Budapest",
  	offset: -60
  },
  { 
  	timezone: "Europe/Copenhagen",
  	gmt: "(GMT+01:00) Copenhagen",
  	offset: -60
  },
  { 
  	timezone: "Europe/Gibraltar",
  	gmt: "(GMT+01:00) Gibraltar",
  	offset: -60
  },
  { 
  	timezone: "Europe/Luxembourg",
  	gmt: "(GMT+01:00) Luxembourg",
  	offset: -60
  },
  { 
  	timezone: "Europe/Madrid",
  	gmt: "(GMT+01:00) Madrid",
  	offset: -60
  },
  { 
  	timezone: "Europe/Malta",
  	gmt: "(GMT+01:00) Malta",
  	offset: -60
  },
  { 
  	timezone: "Europe/Monaco",
  	gmt: "(GMT+01:00) Monaco",
  	offset: -60
  },
  { 
  	timezone: "Europe/Oslo",
  	gmt: "(GMT+01:00) Oslo",
  	offset: -60
  },
  { 
  	timezone: "Europe/Paris",
  	gmt: "(GMT+01:00) Paris",
  	offset: -60
  },
  { 
  	timezone: "Europe/Prague",
  	gmt: "(GMT+01:00) Central European Time - Prague",
  	offset: -60
  },
  { 
  	timezone: "Europe/Rome",
  	gmt: "(GMT+01:00) Rome",
  	offset: -60
  },
  { 
  	timezone: "Europe/Stockholm",
  	gmt: "(GMT+01:00) Stockholm",
  	offset: -60
  },
  { 
  	timezone: "Europe/Tirane",
  	gmt: "(GMT+01:00) Tirane",
  	offset: -60
  },
  { 
  	timezone: "Europe/Vienna",
  	gmt: "(GMT+01:00) Vienna",
  	offset: -60
  },
  { 
  	timezone: "Europe/Warsaw",
  	gmt: "(GMT+01:00) Warsaw",
  	offset: -60
  },
  { 
  	timezone: "Europe/Zurich",
  	gmt: "(GMT+01:00) Zurich",
  	offset: -60
  },
  { 
  	timezone: "Africa/Cairo",
  	gmt: "(GMT+02:00) Cairo",
  	offset: -120
  },
  { 
  	timezone: "Africa/Johannesburg",
  	gmt: "(GMT+02:00) Johannesburg",
  	offset: -120
  },
  { 
  	timezone: "Africa/Maputo",
  	gmt: "(GMT+02:00) Maputo",
  	offset: -120
  },
  { 
  	timezone: "Africa/Tripoli",
  	gmt: "(GMT+02:00) Tripoli",
  	offset: -120
  },
  { 
  	timezone: "Asia/Amman",
  	gmt: "(GMT+02:00) Amman",
  	offset: -120
  },
  { 
  	timezone: "Asia/Beirut",
  	gmt: "(GMT+02:00) Beirut",
  	offset: -120
  },
  { 
  	timezone: "Asia/Damascus",
  	gmt: "(GMT+02:00) Damascus",
  	offset: -120
  },
  { 
  	timezone: "Asia/Gaza",
  	gmt: "(GMT+02:00) Gaza",
  	offset: -120
  },
  {
  	timezone: "Asia/Jerusalem",
  	gmt: "(GMT+02:00) Jerusalem",
  	offset: -120
  },
  {
  	timezone: "Asia/Nicosia",
  	gmt: "(GMT+02:00) Nicosia",
  	offset: -120
  },
  {
  	timezone: "Europe/Athens",
  	gmt: "(GMT+02:00) Athens",
  	offset: -120
  },
  {
  	timezone: "Europe/Bucharest",
  	gmt: "(GMT+02:00) Bucharest",
  	offset: -120
  },
  {
  	timezone: "Europe/Chisinau",
  	gmt: "(GMT+02:00) Chisinau",
  	offset: -120
  },
  {
  	timezone: "Europe/Helsinki",
  	gmt: "(GMT+02:00) Helsinki",
  	offset: -120
  },
  {
  	timezone: "Europe/Istanbul",
  	gmt: "(GMT+02:00) Istanbul",
  	offset: -120
  },
  {
  	timezone: "Europe/Kaliningrad",
  	gmt: "(GMT+02:00) Moscow-01 - Kaliningrad",
  	offset: -120
  },
  {
  	timezone: "Europe/Kiev",
  	gmt: "(GMT+02:00) Kiev",
  	offset: -120
  },
  {
  	timezone: "Europe/Riga",
  	gmt: "(GMT+02:00) Riga",
  	offset: -120
  },
  {
  	timezone: "Europe/Sofia",
  	gmt: "(GMT+02:00) Sofia",
  	offset: -120
  },
  {
  	timezone: "Europe/Tallinn",
  	gmt: "(GMT+02:00) Tallinn",
  	offset: -120
  },
  {
  	timezone: "Europe/Vilnius",
  	gmt: "(GMT+02:00) Vilnius",
  	offset: -120
  },
  {
  	timezone: "Africa/Khartoum",
  	gmt: "(GMT+03:00) Khartoum",
  	offset: -180
  },
  {
  	timezone: "Africa/Nairobi",
  	gmt: "(GMT+03:00) Nairobi",
  	offset: -180
  },
  {
  	timezone: "Antarctica/Syowa",
  	gmt: "(GMT+03:00) Syowa",
  	offset: -180
  },
  {
  	timezone: "Asia/Baghdad",
  	gmt: "(GMT+03:00) Baghdad",
  	offset: -180
  },
  {
  	timezone: "Asia/Qatar",
  	gmt: "(GMT+03:00) Qatar",
  	offset: -180
  },
  {
  	timezone: "Asia/Riyadh",
  	gmt: "(GMT+03:00) Riyadh",
  	offset: -180
  },
  {
  	timezone: "Europe/Minsk",
  	gmt: "(GMT+03:00) Minsk",
  	offset: -180
  },
  {
  	timezone: "Europe/Moscow",
  	gmt: "(GMT+03:00) Moscow+00 - Moscow",
  	offset: -180
  },
  {
  	timezone: "Asia/Tehran",
  	gmt: "(GMT+03:30) Tehran",
  	offset: -180
  },
  {
  	timezone: "Asia/Baku",
  	gmt: "(GMT+04:00) Baku",
  	offset: -240
  },
  {
  	timezone: "Asia/Dubai",
  	gmt: "(GMT+04:00) Dubai",
  	offset: -240
  },
  {
  	timezone: "Asia/Tbilisi",
  	gmt: "(GMT+04:00) Tbilisi",
  	offset: -240
  },
  {
  	timezone: "Asia/Yerevan",
  	gmt: "(GMT+04:00) Yerevan",
  	offset: -240
  },
  {
  	timezone: "Europe/Samara",
  	gmt: "(GMT+04:00) Moscow+01 - Samara",
  	offset: -240
  },
  {
  	timezone: "Indian/Mahe",
  	gmt: "(GMT+04:00) Mahe",
  	offset: -240
  },
  {
  	timezone: "Indian/Mauritius",
  	gmt: "(GMT+04:00) Mauritius",
  	offset: -240
  },
  {
  	timezone: "Indian/Reunion",
  	gmt: "(GMT+04:00) Reunion",
  	offset: -240
  },
  {
  	timezone: "Asia/Kabul",
  	gmt: "(GMT+04:30) Kabul",
  	offset: -240
  },
  {
  	timezone: "Antarctica/Mawson",
  	gmt: "(GMT+05:00) Mawson",
  	offset: -300
  },
  {
  	timezone: "Asia/Aqtau",
  	gmt: "(GMT+05:00) Aqtau",
  	offset: -300
  },
  {
  	timezone: "Asia/Aqtobe",
  	gmt: "(GMT+05:00) Aqtobe",
  	offset: -300
  },
  {
  	timezone: "Asia/Ashgabat",
  	gmt: "(GMT+05:00) Ashgabat",
  	offset: -300
  },
  {
  	timezone: "Asia/Dushanbe",
  	gmt: "(GMT+05:00) Dushanbe",
  	offset: -300
  },
  {
  	timezone: "Asia/Karachi",
  	gmt: "(GMT+05:00) Karachi",
  	offset: -300
  },
  {
  	timezone: "Asia/Tashkent",
  	gmt: "(GMT+05:00) Tashkent",
  	offset: -300
  },
  {
  	timezone: "Asia/Yekaterinburg",
  	gmt: "(GMT+05:00) Moscow+02 - Yekaterinburg",
  	offset: -300
  },
  {
  	timezone: "Indian/Kerguelen",
  	gmt: "(GMT+05:00) Kerguelen",
  	offset: -300
  },
  {
  	timezone: "Indian/Maldives",
  	gmt: "(GMT+05:00) Maldives",
  	offset: -300
  },
  {
  	timezone: "Asia/Calcutta",
  	gmt: "(GMT+05:30) India Standard Time",
  	offset: -330
  },
  {
  	timezone: "Asia/Colombo",
  	gmt: "(GMT+05:30) Colombo",
  	offset: -330
  },
  {
  	timezone: "Asia/Katmandu",
  	gmt: "(GMT+05:45) Katmandu",
  	offset: -345
  },
  {
  	timezone: "Antarctica/Vostok",
  	gmt: "(GMT+06:00) Vostok",
  	offset: -360
  },
  {
  	timezone: "Asia/Almaty",
  	gmt: "(GMT+06:00) Almaty",
  	offset: -360
  },
  {
  	timezone: "Asia/Bishkek",
  	gmt: "(GMT+06:00) Bishkek",
  	offset: -360
  },
  {
  	timezone: "Asia/Dhaka",
  	gmt: "(GMT+06:00) Dhaka",
  	offset: -360
  },
  {
  	timezone: "Asia/Omsk",
  	gmt: "(GMT+06:00) Moscow+03 - Omsk, Novosibirsk",
  	offset: -360
  },
  {
  	timezone: "Asia/Thimphu",
  	gmt: "(GMT+06:00) Thimphu",
  	offset: -360
  },
  {
  	timezone: "Indian/Chagos",
  	gmt: "(GMT+06:00) Chagos",
  	offset: -360
  },
  {
  	timezone: "Asia/Rangoon",
  	gmt: "(GMT+06:30) Rangoon",
  	offset: -390
  },
  {
  	timezone: "Indian/Cocos",
  	gmt: "(GMT+06:30) Cocos",
  	offset: -390
  },
  {
  	timezone: "Antarctica/Davis",
  	gmt: "(GMT+07:00) Davis",
  	offset: -420
  },
  {
  	timezone: "Asia/Bangkok",
  	gmt: "(GMT+07:00) Bangkok",
  	offset: -420
  },
  {
  	timezone: "Asia/Hovd",
  	gmt: "(GMT+07:00) Hovd",
  	offset: -420
  },
  {
  	timezone: "Asia/Jakarta",
  	gmt: "(GMT+07:00) Jakarta",
  	offset: -420
  },
  {
  	timezone: "Asia/Krasnoyarsk",
  	gmt: "(GMT+07:00) Moscow+04 - Krasnoyarsk",
  	offset: -420
  },
  {
  	timezone: "Asia/Saigon",
  	gmt: "(GMT+07:00) Hanoi",
  	offset: -420
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
    gmt: "(GMT+07:00) Ho Chi Minh",
   	offset: -420
 	},
  {
    timezone: "Indian/Christmas",
    gmt: "(GMT+07:00) Christmas",
   	offset: -420
 	},
  {
    timezone: "Antarctica/Casey",
    gmt: "(GMT+08:00) Casey",
   	offset: -480
 	},
  {
    timezone: "Asia/Brunei",
    gmt: "(GMT+08:00) Brunei",
   	offset: -480
 	},
  {
    timezone: "Asia/Choibalsan",
    gmt: "(GMT+08:00) Choibalsan",
   	offset: -480
 	},
  {
    timezone: "Asia/Hong_Kong",
    gmt: "(GMT+08:00) Hong Kong",
   	offset: -480
 	},
  {
    timezone: "Asia/Irkutsk",
    gmt: "(GMT+08:00) Moscow+05 - Irkutsk",
   	offset: -480
 	},
  {
    timezone: "Asia/Kuala_Lumpur",
    gmt: "(GMT+08:00) Kuala Lumpur",
   	offset: -480
 	},
  {
    timezone: "Asia/Macau",
    gmt: "(GMT+08:00) Macau",
   	offset: -480
 	},
  {
    timezone: "Asia/Makassar",
    gmt: "(GMT+08:00) Makassar",
   	offset: -480
 	},
  {
    timezone: "Asia/Manila",
    gmt: "(GMT+08:00) Manila",
   	offset: -480
 	},
  {
    timezone: "Asia/Shanghai",
    gmt: "(GMT+08:00) China Time - Beijing",
   	offset: -480
 	},
  {
    timezone: "Asia/Singapore",
    gmt: "(GMT+08:00) Singapore",
   	offset: -480
 	},
  {
    timezone: "Asia/Taipei",
    gmt: "(GMT+08:00) Taipei",
   	offset: -480
 	},
  {
    timezone: "Asia/Ulaanbaatar",
    gmt: "(GMT+08:00) Ulaanbaatar",
   	offset: -480
 	},
  {
    timezone: "Australia/Perth",
    gmt: "(GMT+08:00) Western Time - Perth",
   	offset: -480
 	},
  {
    timezone: "Asia/Pyongyang",
    gmt: "(GMT+08:30) Pyongyang",
   	offset: -510
 	},
  {
    timezone: "Asia/Dili",
    gmt: "(GMT+09:00) Dili",
   	offset: -540
 	},
  {
    timezone: "Asia/Jayapura",
    gmt: "(GMT+09:00) Jayapura",
   	offset: -540 
 	},
 	{
    timezone: "Asia/Seoul",
    gmt: "(GMT+09:00) Seoul",
   	offset: -540
 	},
  {
    timezone: "Asia/Tokyo",
    gmt: "(GMT+09:00) Tokyo",
   	offset: -540
 	},
  {
    timezone: "Asia/Yakutsk",
    gmt: "(GMT+09:00) Moscow+06 - Yakutsk",
   	offset: -540
 	},
  {
    timezone: "Pacific/Palau",
    gmt: "(GMT+09:00) Palau",
   	offset: -540
 	},
  {
    timezone: "Australia/Adelaide",
    gmt: "(GMT+10:30) Central Time - Adelaide",
   	offset: -630
 	},
  {
    timezone: "Australia/Darwin",
    gmt: "(GMT+09:30) Central Time - Darwin",
   	offset: -570
 	},
  {
    timezone: "Antarctica/DumontDUrville",
    gmt: "(GMT+10:00) Dumont D'Urville",
   	offset: -600
 	},
  {
    timezone: "Asia/Magadan",
    gmt: "(GMT+10:00) Moscow+07 - Magadan",
   	offset: -600
 	},
  {
    timezone: "Asia/Vladivostok",
    gmt: "(GMT+10:00) Moscow+07 - Yuzhno-Sakhalinsk",
   	offset: -600
 	},
  {
    timezone: "Australia/Brisbane",
    gmt: "(GMT+10:00) Eastern Time - Brisbane",
   	offset: -600
 	},
  {
    timezone: "Australia/Hobart",
    gmt: "(GMT+11:00) Eastern Time - Hobart",
   	offset: -660
 	},
  {
    timezone: "Australia/Sydney",
    gmt: "(GMT+11:00) Eastern Time - Melbourne, Sydney",
   	offset: -660
 	},
  {
    timezone: "Pacific/Chuuk",
    gmt: "(GMT+10:00) Truk",
   	offset: -600
 	},
  {
    timezone: "Pacific/Guam",
    gmt: "(GMT+10:00) Guam",
   	offset: -600
 	},
  {
    timezone: "Pacific/Port_Moresby",
    gmt: "(GMT+10:00) Port Moresby",
   	offset: -600
 	},
  {
    timezone: "Pacific/Efate",
    gmt: "(GMT+11:00) Efate",
   	offset: -660
 	},
  {
    timezone: "Pacific/Guadalcanal",
    gmt: "(GMT+11:00) Guadalcanal",
   	offset: -660
 	},
  {
    timezone: "Pacific/Kosrae",
    gmt: "(GMT+11:00) Kosrae",
   	offset: -660
 	},
  {
    timezone: "Pacific/Norfolk",
    gmt: "(GMT+11:00) Norfolk",
   	offset: -660
 	},
  {
    timezone: "Pacific/Noumea",
    gmt: "(GMT+11:00) Noumea",
   	offset: -660
 	},
  {
    timezone: "Pacific/Pohnpei",
    gmt: "(GMT+11:00) Ponape",
   	offset: -660
 	},
  {
    timezone: "Asia/Kamchatka",
    gmt: "(GMT+12:00) Moscow+09 - Petropavlovsk-Kamchatskiy",
   	offset: -720
 	},
  {
    timezone: "Pacific/Auckland",
    gmt: "(GMT+13:00) Auckland",
   	offset: -780
 	},
  {
    timezone: "Pacific/Fiji",
    gmt: "(GMT+13:00) Fiji",
   	offset: -780
 	},
  {
    timezone: "Pacific/Funafuti",
    gmt: "(GMT+12:00) Funafuti",
   	offset: -720
 	},
  {
    timezone: "Pacific/Kwajalein",
    gmt: "(GMT+12:00) Kwajalein",
   	offset: -720
 	},
  {
    timezone: "Pacific/Majuro",
    gmt: "(GMT+12:00) Majuro",
   	offset: -720
 	},
  {
    timezone: "Pacific/Nauru",
    gmt: "(GMT+12:00) Nauru",
   	offset: -720
 	},
  {
    timezone: "Pacific/Tarawa",
    gmt: "(GMT+12:00) Tarawa",
   	offset: -720
 	},
  {
    timezone: "Pacific/Wake",
    gmt: "(GMT+12:00) Wake",
   	offset: -720
 	},
  {
    timezone: "Pacific/Wallis",
    gmt: "(GMT+12:00) Wallis",
   	offset: -720
 	},
  {
    timezone: "Pacific/Apia",
    gmt: "(GMT+14:00) Apia",
   	offset: -840
 	},
  {
    timezone: "Pacific/Enderbury",
    gmt: "(GMT+13:00) Enderbury",
   	offset: -780
 	},
  {
    timezone: "Pacific/Fakaofo",
    gmt: "(GMT+13:00) Fakaofo",
   	offset: -780
 	},
  {
    timezone: "Pacific/Tongatapu",
    gmt: "(GMT+13:00) Tongatapu",
   	offset: -780
 	},
  {
  	timezone: "Pacific/Kiritimati",
  	gmt: "(GMT+14:00) Kiritimati",
		offset: -840
	},
];

export default timezones;