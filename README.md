# thecount #

The count is a stat tracking tool. You create an app, and get an API. Then you post a key and value to thecount server. The server has pre-baked in routes for counting the data:

* `/yourapp/stats/total.json`
* `/yourapp/stats/today.json`
* `/yourapp/stats/monthly.json`

TODO
----

* add tests
* finalize routes
* add baked in views for total, today, monthly, etc (including charts)
* add support open connections (to push stats)
