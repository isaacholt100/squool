use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Role {
    Owner,
    Admin,
    Teacher,
    Student,
}
impl From<&str> for Role {
    fn from(s: &str) -> Self {
        match s {
            "owner" => Self::Owner,
            "admin" => Self::Admin,
            "teacher" => Self::Teacher,
            "student" => Self::Student,
            s => panic!("Can't convert '{}' to Role enum", s),
        }
    }
}
impl From<u8> for Role {
    fn from(int: u8) -> Self {
        match int {
            0 => Self::Owner,
            1 => Self::Admin,
            2 => Self::Teacher,
            3 => Self::Student,
            int => panic!("Can't convert '{}' to Role enum", int),
        }
    }
}