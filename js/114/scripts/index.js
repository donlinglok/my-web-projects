class Elevator {
  // init
  constructor(count) {
    this.count = count;
    this.onFloor = 1;
    this.btnGroup = null;
    this.zoneContainer = this.$(".ew-elevator-storey-zone");
    this.elevator = this.$(".ew-elevator");
    this.generateStorey(this.count || 6);
    this.doorCloseTime = 3 * 1000;
    this.queue_floor = [];
    this.queue_offset = [];
    this.queue_button = [];
    this.isMoving = false;
  }
  $(selector, el = document) {
    return el.querySelector(selector);
  }
  $$(selector, el = document) {
    return el.querySelectorAll(selector);
  }
  addStyles(el, styles) {
    Object.assign(el.style, styles);
  }
  generateStorey(count) {
    let template = "";
    for (let i = count - 1; i >= 0; i--) {
      template += `
                <div class="ew-elevator-storey">
                    <div class="ew-elevator-controller">
                        <button type="button" debug="${i}" class="ew-elevator-to-top ew-elevator-btn" ${i === count - 1 ? "disabled" : ""
        }>↑</button>
                        <button type="button" debug="${i}" class="ew-elevator-to-bottom ew-elevator-btn" ${i === 0 ? "disabled" : ""
        }>↓</button>
                    </div>
                    <div class="ew-elevator-count">${i + 1}</div>
                </div>
            `;
    }
    this.zoneContainer.innerHTML = template;
    this.storeys = this.$$(".ew-elevator-storey", this.zoneContainer);
    this.doors = this.$$(".ew-elevator-door", this.elevator);
    this.btnGroup = this.$$(".ew-elevator-btn", this.zoneContainer);
    [...this.storeys].forEach((item, index) => {
      this.handleClick(
        this.$$(".ew-elevator-btn", item),
        item.offsetHeight,
        index
      );
    });
  }
  handleClick(btnGroup, floorHeight, floorIndex) {
    Array.from(btnGroup).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("checked")) {
          return;
        }
        btn.setAttribute('disabled', true);
        btn.classList.add("checked");
        const targetFloor = this.count - floorIndex;
        const moveFloor = targetFloor - 1;
        this.elevatorMove(targetFloor, floorHeight * moveFloor, btn);
      });
    });
  }
  elevatorMove(num, offset, btn) {
    // FCFS-First Come First Serve
    this.queue_floor.push(num);
    this.queue_offset.push(offset);
    this.queue_button.push(btn);

    if (this.queue_floor.length === 1 && !this.isMoving)
      nextMove();
  }
  moving(num, offset, btn) {
    this.isMoving = true;
    const currentFloor = this.onFloor;
    const diffFloor = Math.abs(num - currentFloor);

    this.addStyles(this.elevator, {
      transitionDuration: diffFloor + "s",
      bottom: offset + "px",
    });

    // wait for elevator move to target floor
    setTimeout(() => {
      // open door
      Array.from(this.doors).forEach((door) => {
        door.classList.add("toggle");
        this.addStyles(door, {
          animationDelay: 0 + "s",
        });
        btn.removeAttribute("disabled");
      });

      // close door
      setTimeout(() => {
        Array.from(this.doors).forEach((door) => door.classList.remove("toggle"));

        this.isMoving = false;

        if (this.queue_floor.length > 0)
          nextMove();
      }, this.doorCloseTime);

      btn.classList.remove("checked");
    }, diffFloor * 1000);

    this.onFloor = num;
  }
  nextMove() {
    // SSTF-Shortest Seek Time First
    let smallest = 9999;
    let tempIndex;
    this.queue_floor.forEach(element, index => {
      if (element != this.onFloor) {
        let tempSmallest = element - this.onFloor;
        if (smallest > tempSmallest) {
          smallest = tempSmallest;
          tempIndex = index;
        }
      }
    });
    this.queue_floor.remove(tempIndex);
    this.queue_offset.remove(tempIndex);
    this.queue_button.remove(tempIndex);

    this.queue_floor.unshift(this.onFloor + smallest);
    this.queue_offset.unshift(this.onFloor + smallest);
    this.queue_button.unshift(this.onFloor + smallest);
    console.log(this.queue_floor);

    // SCAN
    if (this.onFloor == this.count || this.onFloor == 0) {
      let direction = this.onFloor - this.queue_floor.get(0);
      if (direction >= 0) { // go up
        this.queue_floor.sort((a, b) => {
          if (a === Infinity)
            return 1;
          else if (isNaN(a))
            return -1;
          else
            return a + b;
        });
        this.tempQueue_floor = [];
        this.queue_floor.forEach(element, index => {
          if (element < this.queue_floor.get(0)) {
            this.tempQueue_floor.push(element);
            this.queue_floor.remove(index);
          }
        });
        this.queue_floor.concat(this.tempQueue_floor);
        console.log('up: ' + this.queue_floor);
      } else { //go down
        this.queue_floor.sort((a, b) => {
          if (a === Infinity)
            return 1;
          else if (isNaN(a))
            return -1;
          else
            return a - b;
        });
        this.tempQueue_floor = [];
        this.queue_floor.forEach(element, index => {
          if (element > this.queue_floor.get(0)) {
            this.tempQueue_floor.push(element);
            this.queue_floor.remove(index);
          }
        });
        this.queue_floor.concat(this.tempQueue_floor);
        console.log('down: ' + this.queue_floor);
      }
    }

    // LOOK
    let direction2 = this.onFloor - this.queue_floor.get(0);
    if (direction2 >= 0) { // go up
      this.queue_floor.sort((a, b) => {
        if (a === Infinity)
          return 1;
        else if (isNaN(a))
          return -1;
        else
          return a + b;
      });
      this.tempQueue_floor = [];
      this.queue_floor.forEach(element, index => {
        if (element < this.queue_floor.get(0)) {
          this.tempQueue_floor.push(element);
          this.queue_floor.remove(index);
        }
      });
      this.queue_floor.concat(this.tempQueue_floor);
      console.log('up: ' + this.queue_floor);
    } else { //go down
      this.queue_floor.sort((a, b) => {
        if (a === Infinity)
          return 1;
        else if (isNaN(a))
          return -1;
        else
          return a - b;
      });
      this.tempQueue_floor = [];
      this.queue_floor.forEach(element, index => {
        if (element > this.queue_floor.get(0)) {
          this.tempQueue_floor.push(element);
          this.queue_floor.remove(index);
        }
      });
      this.queue_floor.concat(this.tempQueue_floor);
      console.log('down: ' + this.queue_floor);
    }

    // SATF（Shortest Access Time First）
    // TODO

    this.moving(this.queue_floor.shift(), this.queue2.shift(), this.queue_button.shift());
  }
}

