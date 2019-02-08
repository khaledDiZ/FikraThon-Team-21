const fs = require("fs");

class Point {
  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
}

class motors {
  constructor(position) {
    this.position = position;
    this.priority = [];
    this.consumption = 0;
  }
}

class Ride {
  constructor(id, startPoint, endPoint, startTime, endTime) {
    this.id = id;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.startTime = parseInt(startTime);
    this.endTime = parseInt(endTime);
    this.prioritized = false;
  }

  attributeTomotors(motors, cost) {
    motors.priority.push(this);
    motors.position = this.endPoint;
    motors.consumption += cost;
    this.prioritized = true;
  }
}

readRides = lines => {
  ret = [];
  for (i = 0; i < lines.length; i++) {
    ll = lines[i].split(" ");
    ret.push(
      new Ride(
        i,
        new Point(ll[0], ll[1]),
        new Point(ll[2], ll[3]),
        ll[4],
        ll[5]
      )
    );
  }
  return ret;
};

readmotors = n => {
  ret = [];
  for (i = 0; i < n; i++) {
    ret.push(new motors(new Point(0, 0)));
  }
  return ret;
};

distance = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

calculateCost = (motors, ride) => {
  return (
    ride.startTime +
    distance(motors.position, ride.startPoint) +
    distance(ride.startPoint, ride.endPoint) +
    motors.consumption
  );
};

// calculateTotalConsumption = (motors) => {
//   sum = 0;
//   for (i = 0; i < motors.length; i++) {
//     sum += motors[i].consumption;
//   }
//   return sum;
// }

prioritizeRides = (motors, rides) => {
  min_cost = Infinity;
  for (i = 0; i < rides.length; i++) {
    if (!rides[i].prioritized) {
      for (j = 0; j < motors.length; j++) {
        cost = calculateCost(motors[j], rides[i]);
        if (cost < min_cost) {
          min_cost = cost;
          min_motors = j;
          min_ride = i;
        }
      }
    }
  }
  rides[min_ride].attributeTomotors(motors[min_motors], min_cost);
};

printRides = motors => {
  out = "";
  for (i = 0; i < motors.length; i++) {
    if (motors[i].priority.length > 0) {
      out +=
        motors[i].priority.length +
        " " +
        motors[i].priority.map(p => p.id).join(" ") +
        "\n";
    }
  }
  return out;
};

fs.readFile("mansour.csv", "utf8", function(err, contents) {
  let lines = contents.trim().split("\n");
  const [R, C, F, N, B, T] = lines[0].split(" ");
  lines.shift();
  rides = readRides(lines);
  motors = readmotors(F);
  while (rides.filter(r => r.prioritized === false).length > 0) {
    prioritizeRides(motors, rides);
  }
  fs.writeFile("mansourOUT.csv", printRides(motors), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});
