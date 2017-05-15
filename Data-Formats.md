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
  * Each row contains the crowd and flow information on the floor map
    * [x, y, number of person, flow magnitude, flow direction]
* big_clusters: [int32, int32, double, double, double, int32]
  * Each row is a cluster found on the floor map
    * [cluster’s x coordinate, cluster’s y coordinate, flow magnitude, flow direction, cluster’s density, cluster’s area in square meters] 
* small_clusters: [int32, int32, double, double, double, int32, string]
  * Each row is a smaller cluster segmented from the big clusters
    * [cluster’s x coordinate, cluster’s y coordinate, flow magnitude, flow direction, density, exit ID] 
    * cluster area of each small cluster is fixed to 9 square meters
* ppl_cnt: int32 
  * The total number of people on the floor
