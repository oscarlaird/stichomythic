// A spring which accepts a target velocity
// F = -kx - b(v - v_target)
// Adapted from svelte/motion/spring.js

import { writable } from "svelte/store";

export function make_spring(init_value, damping, stiffness, target_velocity, target_value) {
    // user is responsible for animating with tick_spring
    const store = writable({value: init_value, velocity: 0});

    return {
        set: function(set_target_value, set_target_velocity) {
            this.target_value = set_target_value;
            this.target_velocity = set_target_velocity;
        },
        subscribe: store.subscribe,
        store: store,
        // x, v, x_target, v_target
        value: init_value,
        target_value: target_value,
        velocity: 0,
        target_velocity: target_velocity,
        // coeffs
        damping: damping,
        stiffness: stiffness,
        //
        last_time: Date.now(),
    };
}

export function tick_spring(spring) {
    // dt
    let current_time = Date.now();
    let dt = (current_time - spring.last_time) / 1000;
    spring.last_time = current_time;
    // F
    let f_spring = spring.stiffness * (spring.target_value - spring.value);
    let f_damping = -spring.damping * (spring.velocity - spring.target_velocity);
    let a = (f_spring + f_damping) / 1;
    // update
    spring.value += spring.velocity * dt;
    spring.velocity += a * dt;
    // monotonic
    // if (spring.velocity < 0) spring.velocity = 0;
    // set the store to notify subscribers
    spring.store.set({value: spring.value, velocity: spring.velocity});
}

    
