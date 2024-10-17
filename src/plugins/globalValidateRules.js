import { extend } from 'vee-validate';
import { required, required_if } from 'vee-validate/dist/rules';

function requiredValid() {
  return {
    ...required,
    validate(v) {
      return {
        required: true,
        valid: ['', null, undefined].indexOf(v) === -1,
      };
    },
  };
}

function phoneValid() {
  const regExp = new RegExp('^[+0](?:\\d\\s?){9,20}$');
  const regExpKr = new RegExp('^(?:\\d\\s?){9,20}$');
  return {
    validate(v) {
      return regExp.test(v) || regExpKr.test(v);
    },
  };
}

function emailValid() {
  const regExp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return {
    validate(v) {
      if (v.length === 0) return false;
      return regExp.test(v);
    },
  };
}

function hasBigAlphaValid() {
  const regExp = new RegExp(/[A-Z]/);
  return {
    validate(v) {
      return regExp.test(v);
    },
  };
}

function hasSmallAlphaValid() {
  const regExp = new RegExp(/[a-z]/);
  return {
    validate(v) {
      return regExp.test(v);
    },
  };
}

function minmaxValid() {
  return {
    validate(v, { minVal, maxVal }) {
      return minVal <= v.length && v.length <= maxVal;
    },
    params: ['minVal', 'maxVal'],
  };
}

function hasSpecialCharacterValid() {
  const regExp = new RegExp(/[\!\@\#\$\%\^\&\*\(\)\-\_\+\=]/);
  return {
    validate(v) {
      return regExp.test(v);
    },
  };
}

function hasDigitValid() {
  const regExp = new RegExp(/[0-9]/);
  return {
    validate(v) {
      return regExp.test(v);
    },
  };
}

function passwordValid() {
  const regExp = new RegExp(/(^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\+\=]+)$/);
  return {
    validate(v) {
      return regExp.test(v);
    },
  };
}

function equalValid() {
  return {
    validate(v, { target }) {
      return v === target;
    },
    params: ['target'],
  };
}

function notEqualValid() {
  const isEmpty = (val) => ['', null, undefined].indexOf(val) === -1;

  return {
    validate(v, { valid1, valid2 = [] }) {
      let result = {
        valid: false,
        required: true,
      };
      if (!isEmpty(valid1) && valid2.includes(valid1)) {
        if (isEmpty(v)) {
          result = {
            valid: true,
            required: true,
          };
        } else {
          result = {
            valid: false,
            required: true,
          };
        }
      } else {
        result = {
          valid: true,
          required: false,
        };
      }
      return result;
    },
    computesRequired: true,
    params: ['valid1', 'valid2'],
  };
}

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue) {
    extend('required', requiredValid());
    extend('phone', phoneValid());
    extend('email', emailValid());
    extend('has_big_alpha', hasBigAlphaValid());
    extend('has_small_alpha', hasSmallAlphaValid());
    extend('minmax', minmaxValid());
    extend('has_special_character', hasSpecialCharacterValid());
    extend('has_digit', hasDigitValid());
    extend('password', passwordValid());
    extend('equal', equalValid());
    extend('not_equal', notEqualValid());
    extend('required_if', required_if);
  },
};
