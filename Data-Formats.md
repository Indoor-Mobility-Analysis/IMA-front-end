**mapping** is our database
***
**people_count**: to store the number of people in each station at any time
* _id: String
* day: int, to indicate which day in a week (value in [0, 7=0])
* time: int, to indicate which five-minute period starting from 8 AM each day. For example, 0 = 8:00 AM, 1 = 8:05 AM, ..., and etc.
* count: float, the estimated number of people in the station at *day*, *time*.
***
**people_activity**: to store people's activity such as coordinates, flow
* _id: ObjectId
* time_stamp: int32
* floor: int32
* map_data: [int32, int32, int32, double, double]
* big_clusters: [int32, int32, double, double, double, int32]
* small_clusters: [int32, int32, double, double, int32]
