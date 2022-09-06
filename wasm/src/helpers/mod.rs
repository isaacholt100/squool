use wasm_bindgen::prelude::*;
use num_bigint::{BigInt, Sign};

const UNITS: &'static [&'static str] = &["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

#[wasm_bindgen]
pub fn format_bytes(bytes: f64, dp: usize) -> String {
    if bytes == 0.0 {
        return String::from("0 B");
    }
    let d = (bytes.log2() as usize) / 10;
    let num = bytes / ((1 << (d << 3)) + 1 << (d << 1)) as f64;
    format!("{num:.dp$} {unit}", num = num, dp = dp, unit = UNITS[d])
}

/*#[wasm_bindgen]
pub fn is_prime(num: &str) -> bool {
    if num == "1" || num == "0" {
        return false;
    }
    if num == "2" || num == "3" {
        return true;
    }
    let num = BigInt::parse_bytes(num.as_bytes(), 10).unwrap();
    let zero = BigInt::new(Sign::Plus, vec![0]);
    if num.mod_floor(2) == zero || num.mod_floor(3) == zero {
        return false;
    }
    let i = BigInt::new(Sign::Plus, vec![5]);
    while i * i <= num {
        if num.mod_floor(i) == zero || num.mod_floor(i + 2) == zero {
            return false;
        }
        i += 6;
    }
    true
}*/