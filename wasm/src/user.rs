use wasm_bindgen::prelude::*;
use crate::role::Role;
use bson::oid::ObjectId;
use std::str::FromStr;

#[wasm_bindgen]
pub struct User {
    _id: ObjectId,
    email: String,
    icon: String,
    pub role: Role,
    first_name: String,
    last_name: String,
}

#[wasm_bindgen]
impl User {
    pub fn new(_id: &str, email: &str, icon: &str, role: Role, first_name: &str, last_name: &str) -> Self {
        Self {
            _id: ObjectId::from_str(_id).unwrap(),
            email: email.to_string(),
            icon: icon.to_string(),
            role,
            first_name: first_name.to_string(),
            last_name: last_name.to_string(),
        }
    }
    pub fn role_name(&self) -> String {
        String::from(match self.role {
            Role::Admin => "admin",
            Role::Owner => "owner",
            Role::Student => "student",
            Role::Teacher => "teacher",
        })
    }
    pub fn has_permission(&self, permission: u8) -> bool {
        (self.role as u8) <= permission
    }
    pub fn _id(&self) -> String {
        self._id.to_hex()
    }
    pub fn email(&self) -> String {
        self.email.clone()
    }
    pub fn icon(&self) -> String {
        self.icon.clone()
    }
    pub fn eq_id(&self, other: &str) -> bool {
        self._id() == other
    }
    pub fn full_name(&self) -> String {
        format!("{} {}", self.first_name, self.last_name)
    }
    pub fn short_name(&self) -> String {
        match self.role {
            Role::Student => {
                self.first_name.clone()
            },
            _ => {
                self.full_name()
            }
        }
    }
}