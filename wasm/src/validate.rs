use wasm_bindgen::prelude::*;
use validator;

#[wasm_bindgen]
pub fn validate_password(password: &str) -> String {
    if password.len() < 6 {
        return String::from("Password must be at least 6 characters");
    }
    let mut has_digit = false;
    let mut has_letter = false;
    for c in password.chars() {
        if c.is_digit(10) {
            has_digit = true;
        }
        if c.is_alphabetic() {
            has_letter = true;
        }
        if has_letter && has_digit {
            break;
        }
    }
    if !has_digit {
        return String::from("Password must contain at least 1 digit");
    }
    if !has_letter {
        return String::from("Password must contain at least 1 letter");
    }
    return String::new();
}

#[wasm_bindgen]
pub fn validate_email(email: &str) -> bool {
    validator::validate_email(email)
}