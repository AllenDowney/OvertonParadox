import{A as e,B as t,C as n,D as r,E as i,F as a,G as o,H as s,I as c,J as l,K as u,L as d,M as f,N as p,O as m,P as h,R as g,S as _,T as v,U as y,V as b,W as x,X as ee,Y as S,Z as te,_ as C,a as ne,b as re,c as ie,d as ae,f as oe,g as se,h as ce,i as le,j as ue,k as w,l as T,m as de,n as fe,o as pe,p as me,q as he,r as ge,s as _e,t as ve,u as ye,v as be,w as xe,x as Se,y as E,z as D}from"./fit_worker-BScPQdKb.js";function Ce(e,t,n){if(!he(e.shape,t.shape))throw Error(`You called cumprod_into with out of shape [${e.shape.join(`, `)}] and a of shape [${t.shape.join(`, `)}], but out must have the shape of a. Pass out of shape [${t.shape.join(`, `)}].`);if(!Number.isInteger(n)||n<0||n>=t.shape.length)throw Error(`You called cumprod_into with axis = ${n} on an array of rank ${t.shape.length}, but axis must be an integer in [0, ${t.shape.length-1}]. Pass an axis in that range.`);let r=p(t.shape,n),i=t.shape[n];for(let a=0;a<r;a++){let r=f(t,a,n),o=f(e,a,n),s=1;for(let a=0;a<i;a++)s*=t.data[r+a*t.strides[n]],e.data[o+a*e.strides[n]]=s}return e}function we(e,t,n){if(!Number.isInteger(t)||t<0||t>=e.shape.length)throw Error(`You called ops.${n} with axis = ${t} on a variable of rank ${e.shape.length}, but axis must be an integer in [0, ${e.shape.length-1}]. Pass an axis in that range.`)}function Te(e,t){let n=Array(t).fill(d());return n.push(d(null,null,-1)),v(e,...n)}const Ee=/* @__PURE__ */ new Map;function De(e){let n=Ee.get(e);if(n!==void 0)return n;let r=c({name:`cumprod[axis=${e}]`,infer_shape:e=>[...t(e,0)],perform_into:(n,r)=>{Ce(n,t(r,0),e)},grad:(n,r,i)=>[h(Te(oe(Te(a(r,i),e),e),e),t(n,0))],may_alias_input:[0]});return Ee.set(e,r),r}function Oe(e,n){let r=g(e);return we(r,n,`cumprod`),t(s(De(n),[r]).outputs,0)}function ke(e,t,r,i){if(e===null)return t;let a=r-t.shape.length;return a===0?e:n(e,[i,...Array(a).fill(1),...t.shape])}function O(e,t){let n=new Float64Array(e*e);for(let r=0;r<e;r++)for(let i=0;i<e;i++)n[r*e+i]=+!!t(r,i);return ee(n,[e,e])}function Ae(e,t,n){switch(e){case`sum`:return se(t,n);case`max`:return me(t,n);case`min`:return de(t,n);case`prod`:return ce(t,n);case`cumsum`:return oe(t,n);case`cumprod`:return Oe(t,n);case`softmax`:return ie(t,n);case`log_softmax`:return _e(t,n);default:return null}}function je(e,r,a){let o=e.op.name,s=t(e.outputs,0);if(o.startsWith(`reshape[`))return n(r,[a,...s.shape]);if(o.startsWith(`broadcast_to[`))return C(ke(r,t(e.inputs,0),s.shape.length,a),[a,...s.shape]);if(o.startsWith(`expand_dims[`))return E(r,Number(o.slice(12,-1))+1);if(o.startsWith(`permute_dims[`)){let e=o.slice(13,-1).split(`,`).map(e=>Number(e)+1);return _(r,[0,...e])}if(o===`transpose`)return _(r,[0,2,1]);if(o===`view`){let e=i(s);return e===null?null:v(r,d(),...e.spec)}if(o===`pad_into`){let e=Se(s);return e===null?null:re(r,[a,...s.shape],[d(),...e.spec])}return null}function Me(e,r,i){if(![`diag`,`tril`,`triu`,`diagonal`].includes(e))return null;let o=t(i.shape,i.shape.length-1);if(e===`diag`)return a(E(r,2),D(O(o,(e,t)=>e===t)));if(e===`tril`)return a(r,D(O(o,(e,t)=>t<=e)));if(e===`triu`)return a(r,D(O(o,(e,t)=>t>=e)));if(e===`diagonal`){let e=t(r.shape,0);return w(n(r,[e,o*o]),Int32Array.from({length:o},(e,t)=>t*(o+1)),1)}return null}function Ne({a:e,c:r,left:i,right:a},o){if(i===null&&a!==null)return T(a,ae(e));if(i===null||a!==null)return null;let s=t(e.shape,0),c=t(e.shape,1);return n(ye(n(i,[o*s,c]),r),[o,s])}function Pe({a:e,c:r,left:i,right:a},o){let s=t(e.shape,0),c=t(e.shape,1),l=t(r.shape,1);if(i!==null&&a===null)return n(T(n(i,[o*s,c]),r),[o,s,l]);if(i!==null||a===null)return null;let u=n(_(a,[0,2,1]),[o*l,c]);return _(n(T(u,ae(e)),[o,l,s]),[0,2,1])}function Fe(e,n,r){let i=e.op.name,o={a:t(e.inputs,0),c:t(e.inputs,1),left:n[0]??null,right:n[1]??null},{a:s,c,left:l,right:u}=o;return i===`outer`?a(l===null?E(s,1):E(l,2),u===null?c:E(u,1)):i===`matvec`?Ne(o,r):i===`matmul`?Pe(o,r):null}function Ie(n,i,a){let o=n.op.indexing;if(o===void 0)return null;let s=t(n.outputs,0),c=o.axis+1;return o.kind===`take`?o.indices_shape===void 0?w(i,o.indices,c):e(i,o.indices,[1,...o.indices_shape],c):o.indices_shape===void 0?r(i,[a,...s.shape],o.indices,c):m(i,[a,...s.shape],o.indices,[1,...o.indices_shape],c)}function Le(e,n,r){let i=e.outputs.map(()=>[]);for(let a=0;a<r.chains;a++){let r=e.inputs.map((e,t)=>{let r=n[t]??null;return r===null?e:v(r,a)});s(e.op,r).outputs.forEach((e,n)=>t(i,n).push(E(e,0)))}return r.unrolled.set(e.op.name,(r.unrolled.get(e.op.name)??0)+1),i.map(e=>k(e))}function k(e){if(e.length===1)return t(e,0);if(e.length<=7)return be(e,0);let n=[];for(let t=0;t<e.length;t+=7)n.push(k(e.slice(t,t+7)));return k(n)}function Re(e,n,r){let i=e.op.name,a=t(e.outputs,0),o=/^(\w+)\[axis=(\d+)\]$/.exec(i);if(o!==null){let r=Number(o[2])+1,i=Ae(o[1]??``,n,r);if(i!==null)return i.producer===null?[i]:i.producer.outputs;if(o[1]===`split`)return xe(n,e.outputs.map(e=>t(e.shape,r-1)),r)}let s=je(e,n,r)??Me(i,n,a)??Ie(e,n,r);return s===null?null:[s]}function ze(e,n){let{chains:r}=n,i=e.inputs.map(e=>n.batched.get(e.id)??null),a=t(e.outputs,0),o=e.op.name;if(o===`disconnected_grad`&&i[0]!==null&&i[0]!==void 0)return[t(s(e.op,[i[0]]).outputs,0)];if(e.op.elementwise)return[t(s(e.op,e.inputs.map((e,t)=>ke(i[t]??null,e,a.shape.length,r))).outputs,0)];let c=i[0]??null;if(e.inputs.length===1&&c!==null){let t=Re(e,c,r);if(t!==null)return t}let l=/^concatenate\[axis=(\d+)\]$/.exec(o);if(l!==null){let t=e.inputs.map((e,t)=>i[t]??C(e,[r,...e.shape]));return[be(t,Number(l[1])+1)]}let u=e.inputs.length===2?Fe(e,i,r):null;return u===null?Le(e,i,n):[u]}function Be(e,n,r){if(!Number.isInteger(r)||r<1)throw Error(`You called ops.batch_over_chains with chains = ${String(r)}, but the chain count is a positive integer. Pass chains = 1 or more.`);let i={chains:r,batched:/* @__PURE__ */ new Map,unrolled:/* @__PURE__ */ new Map},a=n.map(e=>{let t=b([r,...e.shape],e.name);return i.batched.set(e.id,t),t});for(let r of y(e,n)){if(!r.inputs.some(e=>i.batched.has(e.id)))continue;let e=ze(r,i);r.outputs.forEach((n,r)=>i.batched.set(n.id,t(e,r)))}return{chains:r,inputs:a,outputs:e.map(e=>i.batched.get(e.id)??C(e,[r,...e.shape])),unrolled:i.unrolled}}const Ve=/* @__PURE__ */ new WeakMap;function He(e,t){Ve.set(e,t)}function Ue(e){return Ve.get(e)}function We(e,t,n){for(let r=0;r<t.length;r++){let i=t[r],a=e.beginComputePass();a.setPipeline(i.pipeline),a.setBindGroup(0,i.bindings),n===void 0?i.groups[2]===void 0?a.dispatchWorkgroups(i.groups[0],i.groups[1]):a.dispatchWorkgroups(i.groups[0],i.groups[1],i.groups[2]):a.dispatchWorkgroupsIndirect(n,12*r),a.end()}}function A(e){return e===`float32x2`?2:1}function Ge(e,t,n){if(n===`float32`)e.set(t);else for(let n=0;n<t.length;n++){let r=t[n]??NaN,i=Math.fround(r);e[2*n]=i,e[2*n+1]=Number.isFinite(i)?Math.fround(r-i):0}}function Ke(e,t,n,r){let i=A(r);for(let r=0;r<e.length;r++)e[r]=(t[n+i*r]??NaN)+(i===2?t[n+i*r+1]??0:0)}function j(){return`
struct Fp64ArithmeticUniforms {
  ONE: f32,
  SPLIT: f32,
};

const fp64arithmetic=Fp64ArithmeticUniforms(1.0,4097.0);

struct Fp64Bits {
  sign: u32,
  exponent: i32,
  significand: vec2u,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};

fn fp64_nan(seed: f32) -> f32 {
  let nanBits = 0x7fc00000u | select(0u, 1u, seed < 0.0);
  return bitcast<f32>(nanBits);
}

fn fp64_u64_is_zero(value: vec2u) -> bool {
  return value.x == 0u && value.y == 0u;
}

fn fp64_u64_compare(a: vec2u, b: vec2u) -> i32 {
  if (a.x != b.x) {
    return select(-1, 1, a.x > b.x);
  }
  if (a.y != b.y) {
    return select(-1, 1, a.y > b.y);
  }
  return 0;
}

fn fp64_u64_add(a: vec2u, b: vec2u) -> vec2u {
  let low = a.y + b.y;
  let carry = select(0u, 1u, low < a.y);
  return vec2u(a.x + b.x + carry, low);
}

fn fp64_u64_sub(a: vec2u, b: vec2u) -> vec2u {
  let borrow = select(0u, 1u, a.y < b.y);
  return vec2u(a.x - b.x - borrow, a.y - b.y);
}

fn fp64_u64_shift_left(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u((value.x << shift) | (value.y >> (32u - shift)), value.y << shift);
  }
  if (shift == 32u) {
    return vec2u(value.y, 0u);
  }
  if (shift < 64u) {
    return vec2u(value.y << (shift - 32u), 0u);
  }
  return vec2u(0u);
}

fn fp64_u64_shift_right(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }
  if (shift < 32u) {
    return vec2u(value.x >> shift, (value.y >> shift) | (value.x << (32u - shift)));
  }
  if (shift == 32u) {
    return vec2u(0u, value.x);
  }
  if (shift < 64u) {
    return vec2u(0u, value.x >> (shift - 32u));
  }
  return vec2u(0u);
}

fn fp64_u64_get_bit(value: vec2u, bitIndex: u32) -> bool {
  if (bitIndex >= 64u) {
    return false;
  }
  if (bitIndex >= 32u) {
    return ((value.x >> (bitIndex - 32u)) & 1u) != 0u;
  }
  return ((value.y >> bitIndex) & 1u) != 0u;
}

fn fp64_u64_has_bits_below(value: vec2u, bitCount: u32) -> bool {
  if (bitCount == 0u) {
    return false;
  }
  if (bitCount >= 64u) {
    return !fp64_u64_is_zero(value);
  }
  if (bitCount > 32u) {
    let highBitCount = bitCount - 32u;
    let highMask = (1u << highBitCount) - 1u;
    return value.y != 0u || (value.x & highMask) != 0u;
  }
  if (bitCount == 32u) {
    return value.y != 0u;
  }
  let lowMask = (1u << bitCount) - 1u;
  return (value.y & lowMask) != 0u;
}

fn fp64_u64_shift_right_sticky(value: vec2u, shift: u32) -> vec2u {
  var shifted = fp64_u64_shift_right(value, shift);
  if (fp64_u64_has_bits_below(value, shift)) {
    shifted.y = shifted.y | 1u;
  }
  return shifted;
}

fn fp64_u64_count_leading_zeros(value: vec2u) -> u32 {
  if (value.x != 0u) {
    return countLeadingZeros(value.x);
  }
  return 32u + countLeadingZeros(value.y);
}

fn fp64_round_shift_right_to_u32(value: vec2u, shift: u32) -> u32 {
  if (shift == 0u) {
    return value.y;
  }

  let truncated = fp64_u64_shift_right(value, shift);
  var rounded = truncated.y;
  let guard = fp64_u64_get_bit(value, shift - 1u);
  let hasTrailingBits = fp64_u64_has_bits_below(value, shift - 1u);
  if (guard && (hasTrailingBits || (rounded & 1u) == 1u)) {
    rounded = rounded + 1u;
  }
  return rounded;
}

fn fp64_round_shift_right(value: vec2u, shift: u32) -> vec2u {
  if (shift == 0u) {
    return value;
  }

  var rounded = fp64_u64_shift_right(value, shift);
  let guard = fp64_u64_get_bit(value, shift - 1u);
  let hasTrailingBits = fp64_u64_has_bits_below(value, shift - 1u);
  if (guard && (hasTrailingBits || (rounded.y & 1u) == 1u)) {
    rounded = fp64_u64_add(rounded, vec2u(0u, 1u));
  }
  return rounded;
}

fn fp64_make_f32_bits_from_u64(sign: u32, significand: vec2u, baseExponent: i32) -> u32 {
  if (fp64_u64_is_zero(significand)) {
    return sign << 31u;
  }

  let leadingZeros = fp64_u64_count_leading_zeros(significand);
  let mostSignificantBit = 63u - leadingZeros;
  var exponent = baseExponent + i32(mostSignificantBit);

  if (exponent > 127) {
    return (sign << 31u) | 0x7f800000u;
  }

  if (exponent >= -126) {
    let shift = i32(mostSignificantBit) - 23;
    var significand24: u32;
    if (shift > 0) {
      significand24 = fp64_round_shift_right_to_u32(significand, u32(shift));
    } else {
      significand24 = fp64_u64_shift_left(significand, u32(-shift)).y;
    }

    if (significand24 >= 0x1000000u) {
      significand24 = significand24 >> 1u;
      exponent = exponent + 1;
      if (exponent > 127) {
        return (sign << 31u) | 0x7f800000u;
      }
    }

    return (sign << 31u) | (u32(exponent + 127) << 23u) | (significand24 & 0x7fffffu);
  }

  let scaleExponent = baseExponent + 149;
  var mantissa: u32;
  if (scaleExponent >= 0) {
    mantissa = fp64_u64_shift_left(significand, u32(scaleExponent)).y;
  } else {
    mantissa = fp64_round_shift_right_to_u32(significand, u32(-scaleExponent));
  }

  if (mantissa >= 0x800000u) {
    return (sign << 31u) | 0x00800000u;
  }
  return (sign << 31u) | mantissa;
}

fn fp64_decode_bits(bits: vec2u) -> Fp64Bits {
  let sign = bits.x >> 31u;
  let exponentBits = (bits.x >> 20u) & 0x7ffu;
  let fractionHigh = bits.x & 0xfffffu;
  let fractionLow = bits.y;
  let fraction = vec2u(fractionHigh, fractionLow);

  if (exponentBits == 0x7ffu) {
    let isInf = fp64_u64_is_zero(fraction);
    return Fp64Bits(sign, 0, vec2u(0u), false, isInf, !isInf);
  }

  if (exponentBits == 0u) {
    let isZero = fp64_u64_is_zero(fraction);
    return Fp64Bits(sign, -1022, fraction, isZero, false, false);
  }

  return Fp64Bits(sign, i32(exponentBits) - 1023, vec2u((1u << 20u) | fractionHigh, fractionLow), false, false, false);
}

fn fp64_finite_magnitude_compare(a: Fp64Bits, b: Fp64Bits) -> i32 {
  if (a.exponent != b.exponent) {
    return select(-1, 1, a.exponent > b.exponent);
  }
  return fp64_u64_compare(a.significand, b.significand);
}

struct Fp64RawF32Bits {
  sign: u32,
  baseExponent: i32,
  significand: u32,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};

// Decode an f32 as (-1)^sign * significand * 2^baseExponent. This shared
// integer representation lets normalization remain independent of the
// selected double-single arithmetic implementation.
fn fp64_decode_raw_f32_bits(bits: u32) -> Fp64RawF32Bits {
  let sign = bits >> 31u;
  let exponentBits = (bits >> 23u) & 0xffu;
  let fraction = bits & 0x7fffffu;

  if (exponentBits == 0xffu) {
    return Fp64RawF32Bits(sign, 0, 0u, false, fraction == 0u, fraction != 0u);
  }
  if (exponentBits == 0u) {
    return Fp64RawF32Bits(sign, -149, fraction, fraction == 0u, false, false);
  }
  return Fp64RawF32Bits(
    sign,
    i32(exponentBits) - 150,
    0x800000u | fraction,
    false,
    false,
    false
  );
}

fn fp64_raw_f32_magnitude_compare(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  return select(-1, 1, aMagnitude > bMagnitude);
}

fn fp64_make_raw_residual_f32_bits(
  exactSign: u32,
  exactMagnitude: vec2u,
  exactBaseExponent: i32,
  highBits: u32
) -> u32 {
  if (fp64_u64_is_zero(exactMagnitude)) {
    return 0u;
  }

  let high = fp64_decode_raw_f32_bits(highBits);
  if (high.isInf || high.isNan) {
    return 0u;
  }
  if (high.isZero) {
    return fp64_make_f32_bits_from_u64(exactSign, exactMagnitude, exactBaseExponent);
  }

  let commonBaseExponent = min(exactBaseExponent, high.baseExponent);
  let exactShift = exactBaseExponent - commonBaseExponent;
  let highShift = high.baseExponent - commonBaseExponent;
  if (exactShift >= 64 || highShift >= 64) {
    return 0u;
  }

  let exactAligned = fp64_u64_shift_left(exactMagnitude, u32(exactShift));
  let highAligned = fp64_u64_shift_left(vec2u(0u, high.significand), u32(highShift));
  let comparison = fp64_u64_compare(exactAligned, highAligned);
  if (comparison == 0) {
    return 0u;
  }

  var residualSign = exactSign;
  var residualMagnitude: vec2u;
  if (comparison > 0) {
    residualMagnitude = fp64_u64_sub(exactAligned, highAligned);
  } else {
    residualSign = exactSign ^ 1u;
    residualMagnitude = fp64_u64_sub(highAligned, exactAligned);
  }
  return fp64_make_f32_bits_from_u64(
    residualSign,
    residualMagnitude,
    commonBaseExponent
  );
}

fn fp64_split_raw_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  if (fp64_u64_is_zero(magnitude)) {
    return vec2u(0u);
  }
  let highBits = fp64_make_f32_bits_from_u64(sign, magnitude, baseExponent);
  let rawLowBits = fp64_make_raw_residual_f32_bits(sign, magnitude, baseExponent, highBits);
  let lowBits = select(rawLowBits, 0u, (rawLowBits & 0x7fffffffu) == 0u);
  if ((highBits & 0x7fffffffu) == 0u && (lowBits & 0x7fffffffu) == 0u) {
    return vec2u(0u);
  }
  return vec2u(highBits, lowBits);
}

// Round an arithmetic accumulator to binary64 before splitting it. The
// aligned add/subtract paths retain three guard bits plus a sticky bit, which
// is sufficient for round-to-nearest-even at the binary64 boundary.
fn fp64_split_binary64_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  if (fp64_u64_is_zero(magnitude)) {
    return vec2u(0u);
  }

  let mostSignificantBit = 63u - fp64_u64_count_leading_zeros(magnitude);
  let exponent = baseExponent + i32(mostSignificantBit);
  if (exponent > 1023) {
    return vec2u((sign << 31u) | 0x7f800000u, 0u);
  }

  var roundedMagnitude = magnitude;
  var roundedBaseExponent = baseExponent;
  if (exponent >= -1022) {
    if (mostSignificantBit > 52u) {
      let shift = mostSignificantBit - 52u;
      roundedMagnitude = fp64_round_shift_right(magnitude, shift);
      roundedBaseExponent = baseExponent + i32(shift);
    }
  } else {
    let shift = -1074 - baseExponent;
    if (shift > 0) {
      roundedMagnitude = fp64_round_shift_right(magnitude, u32(shift));
      roundedBaseExponent = -1074;
    }
  }

  if (fp64_u64_is_zero(roundedMagnitude)) {
    return vec2u(0u);
  }
  return fp64_split_raw_accumulator_bits(sign, roundedMagnitude, roundedBaseExponent);
}

fn fp64_add_raw_f32_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_raw_f32_bits(aBits);
  let b = fp64_decode_raw_f32_bits(bBits);

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    if (a.isInf && b.isInf && a.sign != b.sign) {
      return vec2u(0x7fc00000u, 0u);
    }
    return select(vec2u(bBits, 0u), vec2u(aBits, 0u), a.isInf);
  }
  if (a.isZero && b.isZero) {
    return vec2u(0u);
  }
  if (a.isZero) {
    return vec2u(bBits, 0u);
  }
  if (b.isZero) {
    return vec2u(aBits, 0u);
  }

  let exponentDifference = abs(a.baseExponent - b.baseExponent);
  if (exponentDifference > 25) {
    if (fp64_raw_f32_magnitude_compare(aBits, bBits) >= 0) {
      return vec2u(aBits, bBits);
    }
    return vec2u(bBits, aBits);
  }

  let commonBaseExponent = min(a.baseExponent, b.baseExponent);
  let aMagnitude = fp64_u64_shift_left(
    vec2u(0u, a.significand),
    u32(a.baseExponent - commonBaseExponent)
  );
  let bMagnitude = fp64_u64_shift_left(
    vec2u(0u, b.significand),
    u32(b.baseExponent - commonBaseExponent)
  );

  var resultSign = a.sign;
  var resultMagnitude: vec2u;
  if (a.sign == b.sign) {
    resultMagnitude = fp64_u64_add(aMagnitude, bMagnitude);
  } else {
    let comparison = fp64_u64_compare(aMagnitude, bMagnitude);
    if (comparison == 0) {
      return vec2u(0u);
    }
    if (comparison > 0) {
      resultMagnitude = fp64_u64_sub(aMagnitude, bMagnitude);
    } else {
      resultSign = b.sign;
      resultMagnitude = fp64_u64_sub(bMagnitude, aMagnitude);
    }
  }

  return fp64_split_raw_accumulator_bits(
    resultSign,
    resultMagnitude,
    commonBaseExponent
  );
}

fn fp64_add_aligned_magnitudes_to_fp64_bits(
  sign: u32,
  larger: Fp64Bits,
  smaller: Fp64Bits
) -> vec2u {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_add(largeSignificand, smallSignificand);
  return fp64_split_binary64_accumulator_bits(
    sign,
    resultSignificand,
    larger.exponent - 55
  );
}

fn fp64_sub_aligned_magnitudes_to_fp64_bits(
  sign: u32,
  larger: Fp64Bits,
  smaller: Fp64Bits
) -> vec2u {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_sub(largeSignificand, smallSignificand);
  return fp64_split_binary64_accumulator_bits(
    sign,
    resultSignificand,
    larger.exponent - 55
  );
}

fn fp64_add_aligned_magnitudes_to_f32_bits(sign: u32, larger: Fp64Bits, smaller: Fp64Bits) -> u32 {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_add(largeSignificand, smallSignificand);
  return fp64_make_f32_bits_from_u64(sign, resultSignificand, larger.exponent - 55);
}

fn fp64_sub_aligned_magnitudes_to_f32_bits(sign: u32, larger: Fp64Bits, smaller: Fp64Bits) -> u32 {
  let largeSignificand = fp64_u64_shift_left(larger.significand, 3u);
  let smallSignificand = fp64_u64_shift_right_sticky(
    fp64_u64_shift_left(smaller.significand, 3u),
    u32(larger.exponent - smaller.exponent)
  );
  let resultSignificand = fp64_u64_sub(largeSignificand, smallSignificand);
  return fp64_make_f32_bits_from_u64(sign, resultSignificand, larger.exponent - 55);
}

// Subtract two raw binary64 values and round the exact result once to f32.
// The input words are canonical high/low words: .x contains sign/exponent/high
// fraction bits, and .y contains the low 32 fraction bits.
fn sub_fp64u32_to_f32_bits(aBits: vec2u, bBits: vec2u) -> u32 {
  let a = fp64_decode_bits(aBits);
  let b = fp64_decode_bits(bBits);
  let bSubtractionSign = b.sign ^ 1u;

  if (a.isNan || b.isNan) {
    return 0x7fc00000u;
  }
  if (a.isInf && b.isInf) {
    if (a.sign == bSubtractionSign) {
      return (a.sign << 31u) | 0x7f800000u;
    }
    return 0x7fc00000u;
  }
  if (a.isInf) {
    return (a.sign << 31u) | 0x7f800000u;
  }
  if (b.isInf) {
    return (bSubtractionSign << 31u) | 0x7f800000u;
  }
  if (a.isZero && b.isZero) {
    return select(0u, 0x80000000u, a.sign == 1u && b.sign == 0u);
  }

  let magnitudeComparison = fp64_finite_magnitude_compare(a, b);
  if (a.sign == bSubtractionSign) {
    if (magnitudeComparison >= 0) {
      return fp64_add_aligned_magnitudes_to_f32_bits(a.sign, a, b);
    }
    return fp64_add_aligned_magnitudes_to_f32_bits(a.sign, b, a);
  }

  if (magnitudeComparison == 0) {
    return 0u;
  }
  if (magnitudeComparison > 0) {
    return fp64_sub_aligned_magnitudes_to_f32_bits(a.sign, a, b);
  }
  return fp64_sub_aligned_magnitudes_to_f32_bits(bSubtractionSign, b, a);
}

fn sub_fp64u32_to_f32(aBits: vec2u, bBits: vec2u) -> f32 {
  return bitcast<f32>(sub_fp64u32_to_f32_bits(aBits, bBits));
}

// Subtract two raw binary64 values, round once to binary64, then split the
// result into normalized f32 limbs. Finite results must fit within the f32
// exponent range; larger magnitudes map to infinity and smaller magnitudes
// map to zero. The input words use canonical high/low word order.
fn sub_fp64u32_to_fp64_bits(aBits: vec2u, bBits: vec2u) -> vec2u {
  let a = fp64_decode_bits(aBits);
  let b = fp64_decode_bits(bBits);
  let bSubtractionSign = b.sign ^ 1u;

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf && b.isInf) {
    if (a.sign == bSubtractionSign) {
      return vec2u((a.sign << 31u) | 0x7f800000u, 0u);
    }
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf) {
    return vec2u((a.sign << 31u) | 0x7f800000u, 0u);
  }
  if (b.isInf) {
    return vec2u((bSubtractionSign << 31u) | 0x7f800000u, 0u);
  }
  if (a.isZero && b.isZero) {
    return vec2u(0u);
  }

  let magnitudeComparison = fp64_finite_magnitude_compare(a, b);
  if (a.sign == bSubtractionSign) {
    if (magnitudeComparison >= 0) {
      return fp64_add_aligned_magnitudes_to_fp64_bits(a.sign, a, b);
    }
    return fp64_add_aligned_magnitudes_to_fp64_bits(a.sign, b, a);
  }

  if (magnitudeComparison == 0) {
    return vec2u(0u);
  }
  if (magnitudeComparison > 0) {
    return fp64_sub_aligned_magnitudes_to_fp64_bits(a.sign, a, b);
  }
  return fp64_sub_aligned_magnitudes_to_fp64_bits(bSubtractionSign, b, a);
}

fn sub_fp64u32_to_fp64(aBits: vec2u, bBits: vec2u) -> vec2f {
  let resultBits = sub_fp64u32_to_fp64_bits(aBits, bBits);
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn fp64_runtime_zero() -> f32 {
  return fp64arithmetic.ONE * 0.0;
}

fn prevent_fp64_optimization(value: f32) -> f32 {
  return value;
}


struct Fp64F32Bits {
  sign: u32,
  baseExponent: i32,
  significand: u32,
  isZero: bool,
  isInf: bool,
  isNan: bool,
};

// Decode an f32 as (-1)^sign * significand * 2^baseExponent.
fn fp64_decode_f32_bits(bits: u32) -> Fp64F32Bits {
  let sign = bits >> 31u;
  let exponentBits = (bits >> 23u) & 0xffu;
  let fraction = bits & 0x7fffffu;

  if (exponentBits == 0xffu) {
    return Fp64F32Bits(sign, 0, 0u, false, fraction == 0u, fraction != 0u);
  }
  if (exponentBits == 0u) {
    return Fp64F32Bits(sign, -149, fraction, fraction == 0u, false, false);
  }
  return Fp64F32Bits(sign, i32(exponentBits) - 150, 0x800000u | fraction, false, false, false);
}

fn fp64_f32_magnitude_compare(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  return select(-1, 1, aMagnitude > bMagnitude);
}

fn fp64_make_residual_f32_bits(
  exactSign: u32,
  exactMagnitude: vec2u,
  exactBaseExponent: i32,
  highBits: u32
) -> u32 {
  if (fp64_u64_is_zero(exactMagnitude)) {
    return 0u;
  }

  let high = fp64_decode_f32_bits(highBits);
  if (high.isInf || high.isNan) {
    return exactSign << 31u;
  }
  if (high.isZero) {
    return fp64_make_f32_bits_from_u64(exactSign, exactMagnitude, exactBaseExponent);
  }

  let commonBaseExponent = min(exactBaseExponent, high.baseExponent);
  let exactShift = exactBaseExponent - commonBaseExponent;
  let highShift = high.baseExponent - commonBaseExponent;

  // A normal two-sum/two-product residual never needs a shift this large.
  // This guard gives deterministic underflow behavior outside that contract.
  if (exactShift >= 64 || highShift >= 64) {
    return exactSign << 31u;
  }

  let exactAligned = fp64_u64_shift_left(exactMagnitude, u32(exactShift));
  let highAligned = fp64_u64_shift_left(vec2u(0u, high.significand), u32(highShift));
  let comparison = fp64_u64_compare(exactAligned, highAligned);
  if (comparison == 0) {
    return 0u;
  }

  var residualSign = exactSign;
  var residualMagnitude: vec2u;
  if (comparison > 0) {
    residualMagnitude = fp64_u64_sub(exactAligned, highAligned);
  } else {
    residualSign = exactSign ^ 1u;
    residualMagnitude = fp64_u64_sub(highAligned, exactAligned);
  }
  return fp64_make_f32_bits_from_u64(
    residualSign,
    residualMagnitude,
    commonBaseExponent
  );
}

fn fp64_split_accumulator_bits(
  sign: u32,
  magnitude: vec2u,
  baseExponent: i32
) -> vec2u {
  let highBits = fp64_make_f32_bits_from_u64(sign, magnitude, baseExponent);
  let lowBits = fp64_make_residual_f32_bits(sign, magnitude, baseExponent, highBits);
  return vec2u(highBits, lowBits);
}

fn fp64_two_sum_integer_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_f32_bits(aBits);
  let b = fp64_decode_f32_bits(bBits);

  if (a.isNan || b.isNan) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    if (a.isInf && b.isInf && a.sign != b.sign) {
      return vec2u(0x7fc00000u, 0u);
    }
    return select(vec2u(bBits, 0u), vec2u(aBits, 0u), a.isInf);
  }
  if (a.isZero && b.isZero) {
    return vec2u((a.sign & b.sign) << 31u, 0u);
  }
  if (a.isZero) {
    return vec2u(bBits, 0u);
  }
  if (b.isZero) {
    return vec2u(aBits, 0u);
  }

  let exponentDifference = select(
    b.baseExponent - a.baseExponent,
    a.baseExponent - b.baseExponent,
    a.baseExponent >= b.baseExponent
  );

  // Beyond half an ulp, rounding cannot change the larger operand. Returning
  // the smaller operand intact also avoids an unbounded integer alignment.
  // At a power-of-two boundary the spacing below the larger operand is half
  // the spacing above it, so an opposite-sign gap-25 operand can still change
  // the rounded high limb. Gap 26 is the first universally safe early-out.
  if (exponentDifference > 25) {
    if (fp64_f32_magnitude_compare(aBits, bBits) >= 0) {
      return vec2u(aBits, bBits);
    }
    return vec2u(bBits, aBits);
  }

  let commonBaseExponent = min(a.baseExponent, b.baseExponent);
  let aMagnitude = fp64_u64_shift_left(
    vec2u(0u, a.significand),
    u32(a.baseExponent - commonBaseExponent)
  );
  let bMagnitude = fp64_u64_shift_left(
    vec2u(0u, b.significand),
    u32(b.baseExponent - commonBaseExponent)
  );

  var resultSign = a.sign;
  var resultMagnitude: vec2u;
  if (a.sign == b.sign) {
    resultMagnitude = fp64_u64_add(aMagnitude, bMagnitude);
  } else {
    let comparison = fp64_u64_compare(aMagnitude, bMagnitude);
    if (comparison == 0) {
      return vec2u(0u, 0u);
    }
    if (comparison > 0) {
      resultMagnitude = fp64_u64_sub(aMagnitude, bMagnitude);
    } else {
      resultSign = b.sign;
      resultMagnitude = fp64_u64_sub(bMagnitude, aMagnitude);
    }
  }

  return fp64_split_accumulator_bits(resultSign, resultMagnitude, commonBaseExponent);
}

fn fp64_two_sum_integer(a: f32, b: f32) -> vec2f {
  let resultBits = fp64_two_sum_integer_bits(bitcast<u32>(a), bitcast<u32>(b));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn fp64_multiply_significands(a: u32, b: u32) -> vec2u {
  let aLow = a & 0xffffu;
  let aHigh = a >> 16u;
  let bLow = b & 0xffffu;
  let bHigh = b >> 16u;
  let lowProduct = aLow * bLow;
  let crossProduct = aLow * bHigh + aHigh * bLow;
  let highProduct = aHigh * bHigh;

  var result = vec2u(0u, lowProduct);
  result = fp64_u64_add(
    result,
    fp64_u64_shift_left(vec2u(0u, crossProduct), 16u)
  );
  result = fp64_u64_add(result, vec2u(highProduct, 0u));
  return result;
}

fn fp64_two_prod_integer_bits(aBits: u32, bBits: u32) -> vec2u {
  let a = fp64_decode_f32_bits(aBits);
  let b = fp64_decode_f32_bits(bBits);
  let resultSign = a.sign ^ b.sign;

  if (a.isNan || b.isNan || ((a.isZero || b.isZero) && (a.isInf || b.isInf))) {
    return vec2u(0x7fc00000u, 0u);
  }
  if (a.isInf || b.isInf) {
    return vec2u((resultSign << 31u) | 0x7f800000u, resultSign << 31u);
  }
  if (a.isZero || b.isZero) {
    return vec2u(resultSign << 31u, resultSign << 31u);
  }

  let magnitude = fp64_multiply_significands(a.significand, b.significand);
  return fp64_split_accumulator_bits(
    resultSign,
    magnitude,
    a.baseExponent + b.baseExponent
  );
}

fn fp64_two_prod_integer(a: f32, b: f32) -> vec2f {
  let resultBits = fp64_two_prod_integer_bits(bitcast<u32>(a), bitcast<u32>(b));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn fp64_round_add_integer(a: f32, b: f32) -> f32 {
  return fp64_two_sum_integer(a, b).x;
}

fn fp64_round_mul_integer(a: f32, b: f32) -> f32 {
  return fp64_two_prod_integer(a, b).x;
}

fn fp64_f32_finite_exponent(value: Fp64F32Bits) -> i32 {
  let mostSignificantBit = 31u - countLeadingZeros(value.significand);
  return value.baseExponent + i32(mostSignificantBit);
}

fn fp64_scale_f32_integer(value: f32, exponent: i32) -> f32 {
  let decoded = fp64_decode_f32_bits(bitcast<u32>(value));
  if (decoded.isZero || decoded.isInf || decoded.isNan) {
    return value;
  }
  let resultBits = fp64_make_f32_bits_from_u64(
    decoded.sign,
    vec2u(0u, decoded.significand),
    decoded.baseExponent + exponent
  );
  return bitcast<f32>(resultBits);
}

// Divide normalized significands so the hardware operation cannot overflow,
// underflow, or flush a subnormal result. Reapply the exponent with integer
// packing, which also produces subnormal correction limbs without relying on
// floating-point arithmetic to preserve them.
fn fp64_divide_f32_integer(aValue: f32, bValue: f32) -> f32 {
  let a = fp64_decode_f32_bits(bitcast<u32>(aValue));
  let b = fp64_decode_f32_bits(bitcast<u32>(bValue));
  if (a.isZero || b.isZero || a.isInf || b.isInf || a.isNan || b.isNan) {
    return aValue / bValue;
  }

  let aMostSignificantBit = 31u - countLeadingZeros(a.significand);
  let bMostSignificantBit = 31u - countLeadingZeros(b.significand);
  let normalizedABits = fp64_make_f32_bits_from_u64(
    a.sign,
    vec2u(0u, a.significand),
    -i32(aMostSignificantBit)
  );
  let normalizedBBits = fp64_make_f32_bits_from_u64(
    b.sign,
    vec2u(0u, b.significand),
    -i32(bMostSignificantBit)
  );
  let normalizedQuotient = bitcast<f32>(normalizedABits) / bitcast<f32>(normalizedBBits);
  let quotient = fp64_decode_f32_bits(bitcast<u32>(normalizedQuotient));
  let exponentShift =
    a.baseExponent + i32(aMostSignificantBit) -
    b.baseExponent - i32(bMostSignificantBit);
  let quotientBits = fp64_make_f32_bits_from_u64(
    quotient.sign,
    vec2u(0u, quotient.significand),
    quotient.baseExponent + exponentShift
  );
  return bitcast<f32>(quotientBits);
}

fn split(a: f32) -> vec2f {
  let aBits = bitcast<u32>(a);
  let decoded = fp64_decode_f32_bits(aBits);
  if (decoded.isZero || decoded.isInf || decoded.isNan) {
    return vec2f(a, 0.0);
  }

  var roundedHigh = decoded.significand >> 12u;
  let remainder = decoded.significand & 0xfffu;
  if (remainder > 0x800u || (remainder == 0x800u && (roundedHigh & 1u) == 1u)) {
    roundedHigh = roundedHigh + 1u;
  }
  var highMagnitude = vec2u(0u, roundedHigh << 12u);
  var highBits = fp64_make_f32_bits_from_u64(
    decoded.sign,
    highMagnitude,
    decoded.baseExponent
  );
  // Rounding the high limb of a maximum-exponent value can overflow even
  // though the original value is finite. Truncate only in that boundary case
  // so split remains an exact finite decomposition.
  if (fp64_decode_f32_bits(highBits).isInf) {
    roundedHigh = decoded.significand >> 12u;
    highMagnitude = vec2u(0u, roundedHigh << 12u);
    highBits = fp64_make_f32_bits_from_u64(
      decoded.sign,
      highMagnitude,
      decoded.baseExponent
    );
  }
  let lowBits = fp64_make_residual_f32_bits(
    decoded.sign,
    vec2u(0u, decoded.significand),
    decoded.baseExponent,
    highBits
  );
  return vec2f(bitcast<f32>(highBits), bitcast<f32>(lowBits));
}

fn split2(a: vec2f) -> vec2f {
  var result = split(a.x);
  result.y = fp64_round_add_integer(result.y, a.y);
  return result;
}

fn quickTwoSum(a: f32, b: f32) -> vec2f {
  return fp64_two_sum_integer(a, b);
}

fn twoSum(a: f32, b: f32) -> vec2f {
  return fp64_two_sum_integer(a, b);
}

fn twoSub(a: f32, b: f32) -> vec2f {
  let bBits = bitcast<u32>(b) ^ 0x80000000u;
  let resultBits = fp64_two_sum_integer_bits(bitcast<u32>(a), bBits);
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn twoSqr(a: f32) -> vec2f {
  return fp64_two_prod_integer(a, a);
}

fn twoProd(a: f32, b: f32) -> vec2f {
  return fp64_two_prod_integer(a, b);
}

fn sum_fp64(a: vec2f, b: vec2f) -> vec2f {
  var sum = fp64_two_sum_integer(a.x, b.x);
  let lowSum = fp64_two_sum_integer(a.y, b.y);
  sum.y = fp64_round_add_integer(sum.y, lowSum.x);
  sum = fp64_two_sum_integer(sum.x, sum.y);
  sum.y = fp64_round_add_integer(sum.y, lowSum.y);
  return fp64_two_sum_integer(sum.x, sum.y);
}

fn sub_fp64(a: vec2f, b: vec2f) -> vec2f {
  let negatedB = vec2f(
    bitcast<f32>(bitcast<u32>(b.x) ^ 0x80000000u),
    bitcast<f32>(bitcast<u32>(b.y) ^ 0x80000000u)
  );
  return sum_fp64(a, negatedB);
}

fn mul_fp64(a: vec2f, b: vec2f) -> vec2f {
  // Infinite high limbs must not enter cross products with zero low limbs.
  if ((bitcast<u32>(a.x) & 0x7fffffffu) >= 0x7f800000u ||
      (bitcast<u32>(a.y) & 0x7fffffffu) >= 0x7f800000u ||
      (bitcast<u32>(b.x) & 0x7fffffffu) >= 0x7f800000u ||
      (bitcast<u32>(b.y) & 0x7fffffffu) >= 0x7f800000u) {
    return vec2f((a.x + a.y) * (b.x + b.y), 0.0);
  }

  var product = fp64_two_prod_integer(a.x, b.x);
  let crossProduct1 = fp64_round_mul_integer(a.x, b.y);
  product.y = fp64_round_add_integer(product.y, crossProduct1);
  product = fp64_two_sum_integer(product.x, product.y);
  let crossProduct2 = fp64_round_mul_integer(a.y, b.x);
  product.y = fp64_round_add_integer(product.y, crossProduct2);
  return fp64_two_sum_integer(product.x, product.y);
}

fn fp64_scale_fp64_integer(value: vec2f, exponent: i32) -> vec2f {
  let high = fp64_scale_f32_integer(value.x, exponent);
  let low = fp64_scale_f32_integer(value.y, exponent);
  return sum_fp64(vec2f(high, 0.0), vec2f(low, 0.0));
}

fn fp64_div_fp64_normalized(a: vec2f, b: vec2f) -> vec2f {
  let quotientHigh = fp64_divide_f32_integer(a.x, b.x);
  var quotient = vec2f(quotientHigh, 0.0);

  let remainder = sub_fp64(a, mul_fp64(b, quotient));
  let quotientLow = fp64_divide_f32_integer(remainder.x, b.x);
  quotient = sum_fp64(quotient, vec2f(quotientLow, 0.0));

  let secondRemainder = sub_fp64(a, mul_fp64(b, quotient));
  let correction = fp64_divide_f32_integer(secondRemainder.x, b.x);
  return sum_fp64(quotient, vec2f(correction, 0.0));
}

fn div_fp64(a: vec2f, b: vec2f) -> vec2f {
  let decodedA = fp64_decode_f32_bits(bitcast<u32>(a.x));
  let decodedB = fp64_decode_f32_bits(bitcast<u32>(b.x));
  if (
    decodedA.isZero || decodedB.isZero ||
    decodedA.isInf || decodedB.isInf ||
    decodedA.isNan || decodedB.isNan
  ) {
    return vec2f(a.x / b.x, 0.0);
  }

  let exponentA = fp64_f32_finite_exponent(decodedA);
  let exponentB = fp64_f32_finite_exponent(decodedB);
  // Correct the quotient near unity so b * q and the remainder stay clear of
  // both f32 underflow and overflow. The exponent difference is applied once.
  let normalizedA = fp64_scale_fp64_integer(a, -exponentA);
  let normalizedB = fp64_scale_fp64_integer(b, -exponentB);
  let normalizedQuotient = fp64_div_fp64_normalized(normalizedA, normalizedB);
  return fp64_scale_fp64_integer(normalizedQuotient, exponentA - exponentB);
}

fn fp64_sqrt_fp64_normalized(a: vec2f) -> vec2f {
  let estimate = sqrt(a.x);
  let difference = sub_fp64(a, fp64_two_prod_integer(estimate, estimate)).x;
  let denominator = fp64_round_add_integer(estimate, estimate);
  let correction = fp64_divide_f32_integer(difference, denominator);
  return sum_fp64(vec2f(estimate, 0.0), vec2f(correction, 0.0));
}

fn sqrt_fp64(a: vec2f) -> vec2f {
  let decoded = fp64_decode_f32_bits(bitcast<u32>(a.x));
  let decodedLow = fp64_decode_f32_bits(bitcast<u32>(a.y));
  if (decoded.isZero && decodedLow.isZero) {
    return vec2f(0.0, 0.0);
  }
  if (decoded.sign == 1u) {
    let nanValue = fp64_nan(a.x);
    return vec2f(nanValue, nanValue);
  }

  if (decoded.isInf || decoded.isNan) {
    return fp64_sqrt_fp64_normalized(a);
  }
  let exponent = fp64_f32_finite_exponent(decoded);
  // An even scale lets the final square-root rescale use an integer exponent.
  let evenExponent = exponent - (exponent & 1);
  let normalizedA = fp64_scale_fp64_integer(a, -evenExponent);
  let normalizedRoot = fp64_sqrt_fp64_normalized(normalizedA);
  return fp64_scale_fp64_integer(normalizedRoot, evenExponent / 2);
}


fn fp64_f32_bits_is_nan(bits: u32) -> bool {
  return (bits & 0x7fffffffu) > 0x7f800000u;
}

fn fp64_f32_bits_is_inf(bits: u32) -> bool {
  return (bits & 0x7fffffffu) == 0x7f800000u;
}

fn fp64_compare_f32_bits(aBits: u32, bBits: u32) -> i32 {
  let aMagnitude = aBits & 0x7fffffffu;
  let bMagnitude = bBits & 0x7fffffffu;
  if (aMagnitude == 0u && bMagnitude == 0u) {
    return 0;
  }
  let aSign = aBits >> 31u;
  let bSign = bBits >> 31u;
  if (aSign != bSign) {
    return select(1, -1, aSign == 1u);
  }
  if (aMagnitude == bMagnitude) {
    return 0;
  }
  let magnitudeComparison = select(-1, 1, aMagnitude > bMagnitude);
  return select(magnitudeComparison, -magnitudeComparison, aSign == 1u);
}

// Normalize an arbitrary pair of finite f32 limbs with integer accumulation.
// This is independent of LUMA_FP64_INTEGER_ARITHMETIC and canonicalizes every
// representation of zero to vec2f(+0.0, +0.0).
fn normalize_fp64(value: vec2f) -> vec2f {
  let resultBits = fp64_add_raw_f32_bits(bitcast<u32>(value.x), bitcast<u32>(value.y));
  return vec2f(bitcast<f32>(resultBits.x), bitcast<f32>(resultBits.y));
}

fn is_nan_fp64(value: vec2f) -> bool {
  let normalized = normalize_fp64(value);
  return fp64_f32_bits_is_nan(bitcast<u32>(normalized.x)) ||
    fp64_f32_bits_is_nan(bitcast<u32>(normalized.y));
}

fn is_finite_fp64(value: vec2f) -> bool {
  let normalized = normalize_fp64(value);
  let highBits = bitcast<u32>(normalized.x);
  let lowBits = bitcast<u32>(normalized.y);
  return !fp64_f32_bits_is_nan(highBits) && !fp64_f32_bits_is_nan(lowBits) &&
    !fp64_f32_bits_is_inf(highBits) && !fp64_f32_bits_is_inf(lowBits);
}

// Returns -1, 0, or 1. NaN is unordered and returns 0; call is_nan_fp64 or
// is_finite_fp64 first when 0 must mean a finite zero.
fn sign_fp64(value: vec2f) -> i32 {
  let normalized = normalize_fp64(value);
  let highBits = bitcast<u32>(normalized.x);
  let lowBits = bitcast<u32>(normalized.y);
  if (fp64_f32_bits_is_nan(highBits) || fp64_f32_bits_is_nan(lowBits)) {
    return 0;
  }
  if ((highBits & 0x7fffffffu) != 0u) {
    return select(1, -1, (highBits >> 31u) == 1u);
  }
  if ((lowBits & 0x7fffffffu) != 0u) {
    return select(1, -1, (lowBits >> 31u) == 1u);
  }
  return 0;
}

// Compares double-single values and returns -1, 0, or 1. NaN is unordered
// and returns 0; callers that require equality semantics must first check
// is_nan_fp64 or is_finite_fp64.
fn compare_fp64(a: vec2f, b: vec2f) -> i32 {
  let normalizedA = normalize_fp64(a);
  let normalizedB = normalize_fp64(b);
  let aHighBits = bitcast<u32>(normalizedA.x);
  let aLowBits = bitcast<u32>(normalizedA.y);
  let bHighBits = bitcast<u32>(normalizedB.x);
  let bLowBits = bitcast<u32>(normalizedB.y);
  if (fp64_f32_bits_is_nan(aHighBits) || fp64_f32_bits_is_nan(aLowBits) ||
      fp64_f32_bits_is_nan(bHighBits) || fp64_f32_bits_is_nan(bLowBits)) {
    return 0;
  }
  let highComparison = fp64_compare_f32_bits(aHighBits, bHighBits);
  if (highComparison != 0) {
    return highComparison;
  }
  return fp64_compare_f32_bits(aLowBits, bLowBits);
}

const GPU_LN2:vec2f=vec2f(0.6931471824645996,-1.904654323148236e-9);
const GPU_MAXLOG:vec2f=vec2f(88.72283935546875,-3.034003839275101e-7);
const GPU_MINLOG:vec2f=vec2f(-103.97207641601562,-6.679761668237916e-7);
fn gpu_pair(v:f32)->vec2f{return vec2f(v,0.0);}
fn gpu_pair_nan()->vec2f{return vec2f(bitcast<f32>(0x7fc00000u+u32(fp64_runtime_zero())),0.0);}
fn gpu_pair_inf()->vec2f{return vec2f(bitcast<f32>(0x7f800000u+u32(fp64_runtime_zero())),0.0);}
fn gpu_pair_exp(a:vec2f)->vec2f{
if(is_nan_fp64(a)){return gpu_pair_nan();}if(compare_fp64(a,GPU_MAXLOG)>0){return gpu_pair_inf();}if(compare_fp64(a,GPU_MINLOG)<0){return gpu_pair(0.0);}
let m=i32(floor(a.x/GPU_LN2.x+0.5));let r=fp64_scale_fp64_integer(sub_fp64(a,mul_fp64(GPU_LN2,gpu_pair(f32(m)))),-4);
var term=gpu_pair(1.0);var value=term;
for(var j=1u;j<=8u;j++){term=div_fp64(mul_fp64(term,r),gpu_pair(f32(j)));value=sum_fp64(value,term);}
for(var j=0u;j<4u;j++){value=mul_fp64(value,value);}return fp64_scale_fp64_integer(value,m);
}
fn gpu_pair_log(a:vec2f)->vec2f{
if(sign_fp64(a)<0 || is_nan_fp64(a)){return gpu_pair_nan();}if(sign_fp64(a)==0){return -gpu_pair_inf();}if(!is_finite_fp64(a)){return gpu_pair_inf();}
var value=gpu_pair(log(a.x));for(var j=0u;j<2u;j++){value=sum_fp64(value,sub_fp64(mul_fp64(a,gpu_pair_exp(-value)),gpu_pair(1.0)));}return value;
}
fn gpu_pair_floor(a:vec2f)->vec2f{
if(!is_finite_fp64(a)){return a;}var value=sum_fp64(gpu_pair(floor(a.x)),gpu_pair(floor(a.y)));
if(compare_fp64(sub_fp64(a,value),gpu_pair(1.0))>=0){value=sum_fp64(value,gpu_pair(1.0));}return value;
}
fn gpu_pair_pow(a:vec2f,b:vec2f)->vec2f{
if(!is_nan_fp64(b)&&sign_fp64(b)==0){return gpu_pair(1.0);}if(is_nan_fp64(a)||is_nan_fp64(b)){return gpu_pair_nan();}
let magnitude=gpu_pair_abs(a);
if(!is_finite_fp64(b)){let relation=compare_fp64(magnitude,gpu_pair(1.0));if(relation==0){return gpu_pair_nan();}return select(gpu_pair(0.0),gpu_pair_inf(),(relation>0)==(sign_fp64(b)>0));}
if(sign_fp64(a)==0){return select(gpu_pair_inf(),gpu_pair(0.0),sign_fp64(b)>0);}
var negative=false;
if(sign_fp64(a)<0){if(is_finite_fp64(a)&&compare_fp64(gpu_pair_floor(b),b)!=0){return gpu_pair_nan();}let half=fp64_scale_fp64_integer(b,-1);negative=compare_fp64(gpu_pair_floor(half),half)!=0;}
let value=gpu_pair_exp(mul_fp64(b,gpu_pair_log(magnitude)));return select(value,-value,negative);
}
// Small arguments retain their low limbs without subtracting a rounded one.
fn gpu_pair_expm1(a:vec2f)->vec2f{
if(is_nan_fp64(a)){return gpu_pair_nan();}if(!is_finite_fp64(a)){return select(gpu_pair(-1.0),gpu_pair_inf(),sign_fp64(a)>0);}
if(compare_fp64(gpu_pair_abs(a),gpu_pair(0.5))>0 || !is_finite_fp64(a)){return sub_fp64(gpu_pair_exp(a),gpu_pair(1.0));}
var term=a;var value=a;
for(var j=2u;j<=20u;j++){term=div_fp64(mul_fp64(term,a),gpu_pair(f32(j)));value=sum_fp64(value,term);}return value;
}
fn gpu_pair_log1p(a:vec2f)->vec2f{
if(!is_finite_fp64(a)){return select(gpu_pair_nan(),gpu_pair_inf(),sign_fp64(a)>0 && !is_nan_fp64(a));}
if(compare_fp64(gpu_pair_abs(a),gpu_pair(0.5))>0 || !is_finite_fp64(a)){return gpu_pair_log(sum_fp64(gpu_pair(1.0),a));}
let z=div_fp64(a,sum_fp64(gpu_pair(2.0),a));let square=mul_fp64(z,z);var term=z;var value=z;
for(var j=3u;j<=33u;j+=2u){term=mul_fp64(term,square);value=sum_fp64(value,div_fp64(term,gpu_pair(f32(j))));}return fp64_scale_fp64_integer(value,1);
}
fn gpu_pair_sinh(a:vec2f)->vec2f{
if(!is_finite_fp64(a)){return a;}
let magnitude=gpu_pair_abs(a);var value:vec2f;
if(compare_fp64(magnitude,gpu_pair(0.5))<=0 && is_finite_fp64(a)){
let e=gpu_pair_expm1(magnitude);value=fp64_scale_fp64_integer(sum_fp64(e,div_fp64(e,sum_fp64(gpu_pair(1.0),e))),-1);
}else{value=sub_fp64(gpu_pair_exp(sub_fp64(magnitude,GPU_LN2)),gpu_pair_exp(sub_fp64(-magnitude,GPU_LN2)));}
return select(value,-value,sign_fp64(a)<0);
}
fn gpu_pair_cosh(a:vec2f)->vec2f{
if(!is_finite_fp64(a)){return select(gpu_pair_inf(),gpu_pair_nan(),is_nan_fp64(a));}
let magnitude=gpu_pair_abs(a);return sum_fp64(gpu_pair_exp(sub_fp64(magnitude,GPU_LN2)),gpu_pair_exp(sub_fp64(-magnitude,GPU_LN2)));
}
fn gpu_pair_tanh(a:vec2f)->vec2f{
if(is_nan_fp64(a)){return gpu_pair_nan();}let magnitude=gpu_pair_abs(a);var value:vec2f;
if(compare_fp64(magnitude,gpu_pair(20.0))>0){value=gpu_pair(1.0);}
else if(compare_fp64(magnitude,gpu_pair(0.5))<=0){let e=gpu_pair_expm1(fp64_scale_fp64_integer(magnitude,1));value=div_fp64(e,sum_fp64(e,gpu_pair(2.0)));}
else{let e=gpu_pair_exp(-fp64_scale_fp64_integer(magnitude,1));value=div_fp64(sub_fp64(gpu_pair(1.0),e),sum_fp64(gpu_pair(1.0),e));}
return select(value,-value,sign_fp64(a)<0);
}
fn gpu_pair_truth(a:vec2f)->bool{return is_nan_fp64(a)||sign_fp64(a)!=0;}
fn gpu_pair_abs(a:vec2f)->vec2f{return select(a,-a,sign_fp64(a)<0);}
fn gpu_pair_min(a:vec2f,b:vec2f)->vec2f{if(is_nan_fp64(a)||is_nan_fp64(b)){return gpu_pair_nan();}return select(b,a,compare_fp64(a,b)<0);}
fn gpu_pair_max(a:vec2f,b:vec2f)->vec2f{if(is_nan_fp64(a)||is_nan_fp64(b)){return gpu_pair_nan();}return select(b,a,compare_fp64(a,b)>0);}
fn gpu_pair_sigmoid(a:vec2f)->vec2f{if(sign_fp64(a)>=0){return div_fp64(gpu_pair(1.0),sum_fp64(gpu_pair(1.0),gpu_pair_exp(-a)));}let e=gpu_pair_exp(a);return div_fp64(e,sum_fp64(gpu_pair(1.0),e));}
fn gpu_pair_softplus(a:vec2f)->vec2f{return sum_fp64(gpu_pair_max(a,gpu_pair(0.0)),gpu_pair_log(sum_fp64(gpu_pair(1.0),gpu_pair_exp(-gpu_pair_abs(a)))));}
`}const M=String.raw`// sgemm_small: C = alpha * op(A) * op(B) + beta * C : small-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_large.wgsl).
// BM=BN=32, BK=8, TM=TN=2 : wins over the large tile below a 6x6=36
// workgroup grid of 64-tiles, where the large tile doesn't have enough
// workgroups to fill the GPU. Same structure as sgemm_large.wgsl (2D
// register-blocked, shared-memory-tiled), just smaller.
//
// A and B are bound twice : scalar array<f32> and array<vec4<f32>> views of
// the same GPUBuffer (see vec4ViewBinding) : so each tile load can issue
// 16-byte vector reads along op(A)/op(B)'s contiguous dimension when the
// stride allows it (stride % 4 == 0 keeps every row base 16-byte aligned).
// NUM_THREADS (256) exceeds some small-tile load shapes, so the vectorized
// paths whose lane count doesn't tile exactly guard their As/Bs stores.
//
// col mapped to gid.x for coalesced B/C access (row-major: col contiguous).

const BM: u32 = 32u;
const BN: u32 = 32u;
const BK: u32 = 8u;
const TM: u32 = 2u;
const TN: u32 = 2u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 256
const STRIDE_A: u32 = NUM_THREADS / BK;
const STRIDE_B: u32 = NUM_THREADS / BN;

@group(0) @binding(0) var<storage, read>       A:  array<f32>;
@group(0) @binding(1) var<storage, read>       A4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       B:  array<f32>;
@group(0) @binding(3) var<storage, read>       B4: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> C:  array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
  useVecA: u32, // 1 = A's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = B's vec4 view covers every in-bounds element
}

@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    // ── Load the BM×BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) ──
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // spans BM/4×(BK/4) several times over : guard the store.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      if (r4 < BM) {
        let gRow = blockRow + r4;
        let gCol = t * BK + c4 * 4u;
        var v = A4[(gRow * params.lda + gCol) / 4u];
        let rowOK = gRow < params.m;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.k);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.k);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.k);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.k);
        As[r4 * BK + c4 * 4u]      = v.x;
        As[r4 * BK + c4 * 4u + 1u] = v.y;
        As[r4 * BK + c4 * 4u + 2u] = v.z;
        As[r4 * BK + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. NUM_THREADS over-spans
      // the BK-column tile : guard the store.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      if (c < BK) {
        let gRow = blockRow + r4 * 4u;
        let gCol = t * BK + c;
        var v = A4[(gCol * params.lda + gRow) / 4u];
        let colOK = gCol < params.k;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
        As[(r4 * 4u) * BK + c]      = v.x;
        As[(r4 * 4u + 1u) * BK + c] = v.y;
        As[(r4 * 4u + 2u) * BK + c] = v.z;
        As[(r4 * 4u + 3u) * BK + c] = v.w;
      }
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
      }
    }

    // ── Load the BK×BN B tile into Bs ──
    if (params.useVecB == 1u && params.transB == 0u) {
      // No-transpose: columns contiguous, one vec4 per thread. NUM_THREADS
      // over-spans the BK-row tile : guard the store.
      let r  = tid / (BN / 4u);
      let c4 = tid % (BN / 4u);
      if (r < BK) {
        let gRow = t * BK + r;
        let gCol = blockCol + c4 * 4u;
        var v = B4[(gRow * params.ldb + gCol) / 4u];
        let rowOK = gRow < params.k;
        v.x = select(0.0, v.x, rowOK &&  gCol            < params.n);
        v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.n);
        v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.n);
        v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.n);
        Bs[r * BN + c4 * 4u]      = v.x;
        Bs[r * BN + c4 * 4u + 1u] = v.y;
        Bs[r * BN + c4 * 4u + 2u] = v.z;
        Bs[r * BN + c4 * 4u + 3u] = v.w;
      }
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column, one vec4 per thread :
      // NUM_THREADS over-spans the 32-column tile, so guard the store.
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      if (c < BN) {
        let gRow = t * BK + r4 * 4u;
        let gCol = blockCol + c;
        var v = B4[(gCol * params.ldb + gRow) / 4u];
        let colOK = gCol < params.n;
        v.x = select(0.0, v.x, colOK &&  gRow            < params.k);
        v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.k);
        v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.k);
        v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.k);
        Bs[(r4 * 4u) * BN + c]     = v.x;
        Bs[(r4 * 4u + 1u) * BN + c] = v.y;
        Bs[(r4 * 4u + 2u) * BN + c] = v.z;
        Bs[(r4 * 4u + 3u) * BN + c] = v.w;
      }
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
      }
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        if (col < params.n) {
          let cIdx = row * params.ldc + col;
          // BLAS beta==0 semantics: C is written, not accumulated : must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
`;function qe(e){let{strides:t,offset:n}=e.record;return n<0?null:t[1]===1&&(t[0]??0)>0?{leading:t[0]??1,transposed:0}:t[0]===1&&(t[1]??0)>0?{leading:t[1]??1,transposed:1}:null}function N(e,t){return[Math.ceil(t/32),Math.ceil(e/32)]}function P(e,n){let r=t(e,0),i=t(e,1),a=n.record.shape[0]??0,o=n.record.shape[1]??0,s=r.record.shape[1]??0,c=qe(r),l=qe(i);return a<8||o<8||a*o<4096||s<4||c===null||l===null||Math.ceil(a/32)>65535||Math.ceil(o/32)>65535||S(r.record.shape)<4||S(i.record.shape)<4?null:{m:a,n:o,k:s,left:c,right:l}}function Je(e,t){let n=P(e,t);if(n===null)return 1;let[r,i]=N(n.m,n.n),a=r*i;return a>=256||n.k<256?1:Math.max(1,Math.min(64,Math.floor(n.k/128),Math.ceil(256/a)))}function Ye(e,n,r,i=!0){let a=/* @__PURE__ */ new Map;if(!i)return a;for(let i of e){if(i.op.name!==`matmul`||i.outputs.length!==1)continue;let e=t(i.outputs,0),o=i.inputs.map(e=>n.get(e.id)),s=n.get(e.id);if(s===void 0||o.some(e=>e===void 0))continue;let c=Je(o,s);c!==1&&(a.set(e.id,r.length),r.push(c*S(e.shape)))}return a}function Xe(e,t,n,r,i){let{m:a,n:o,left:s,right:c}=n,l=e.record.offset+(s.transposed===0?r.start:r.start*s.leading),u=t.record.offset+(c.transposed===0?r.start*c.leading:r.start),d=`const params:Params=Params(${a}u,${o}u,${r.count}u,1.0,0.0,${s.leading}u,${c.leading}u,${o}u,${s.transposed}u,${c.transposed}u,0u,0u);`;return{code:M.replace(`@group(0) @binding(5) var<uniform> params: Params;`,d).replace(/\bA\[([^\]]+)\]/g,`A[${l}u + ($1)]`).replace(/\bB\[([^\]]+)\]/g,`B[${u}u + ($1)]`).replace(/\bC\[([^\]]+)\]/g,`C[${i.offset}u + ($1)]`),slots:[e.slot,e.slot,t.slot,t.slot,i.slot],groups:N(a,o)}}function Ze(e,t,n,r,i,a){let{m:o,n:s,k:c,left:l,right:u}=n,d=`const params:Params=Params(${o}u,${s}u,${c}u,1.0,0.0,${l.leading}u,${u.leading}u,${s}u,${l.transposed}u,${u.transposed}u,0u,0u);`,f=l.transposed===0?`kStart`:`kStart*${l.leading}u`,p=u.transposed===0?`kStart*${u.leading}u`:`kStart`,m=M.replace(`@group(0) @binding(5) var<uniform> params: Params;`,d).replace(/\bparams\.k\b/g,`kCount`).replace(`  let blockCol = wid.x * BN;
`,`  let blockCol = wid.x * BN;\n  let kStart = wid.z * ${r}u;\n  let kCount = min(${r}u, ${c}u - kStart);\n  let aShift = ${f};\n  let bShift = ${p};\n  let cShift = wid.z * ${o*s}u;\n`).replace(/\bA\[([^\]]+)\]/g,`A[${e.record.offset}u + aShift + ($1)]`).replace(/\bB\[([^\]]+)\]/g,`B[${t.record.offset}u + bShift + ($1)]`).replace(/\bC\[([^\]]+)\]/g,`C[cShift + ($1)]`),[h,g]=N(o,s);return{code:m,slots:[e.slot,e.slot,t.slot,t.slot,a],groups:[h,g,i]}}function Qe(e,t,n,r){let i=Math.ceil(r/64);return{slots:[e,t.slot],groups:[Math.min(i,65535),Math.ceil(i/65535)],code:`@group(0) @binding(0) var<storage,read> parts:array<f32>;
@group(0) @binding(1) var<storage,read_write> out:array<f32>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${r}u){return;}
var value:f32=0.0;for(var s=0u;s<${n}u;s++){value=value+parts[s*${r}u+i];}out[${t.record.offset}u+i]=value;}`}}function $e(e,n){let r=P(e,n);return r===null?null:Xe(t(e,0),t(e,1),r,{start:0,count:r.k},{slot:n.slot,offset:n.record.offset})}function et(e,n,r){let i=P(e,n);if(i===null)return null;let a=Je(e,n),o=$e(e,n);if(a===1||o===null)return o===null?null:[o];if(r===void 0)throw Error(`You called mdl.compile_model with a split matrix product and no scratch buffer, but every split product needs its partial sums. Recompile the complete model graph.`);let s=i.m*i.n,c=Math.ceil(i.k/a),l=Math.ceil(i.k/c);return[Ze(t(e,0),t(e,1),i,c,l,r),Qe(r,n,l,s)]}function F(e){return{data:/* @__PURE__ */ new Float64Array,shape:[...e],strides:o(e),offset:0}}function I(e,t){let n=o(e.shape),r=e.shape.map((r,i)=>{let a=e.strides[i]??0;return r<=1||a===0?`0`:`i32(((${t}) / ${n[i]}u) % ${r}u) * ${a}`});return`(${e.offset} + ${r.length===0?`0`:r.join(` + `)})`}function tt(e,t=`float32`){let n=A(t),r=S(e.shape),i=new Float32Array(r*n),a=o(e.shape);for(let t=0;t<r;t++){let r=e.offset;for(let n=0;n<e.shape.length;n++){let i=e.shape[n]??1;r+=Math.floor(t/(a[n]??1))%i*(e.strides[n]??0)}let o=e.data[r]??NaN,s=Math.fround(o);i[t*n]=s,n===2&&(i[t*n+1]=Number.isFinite(s)?Math.fround(o-s):0)}return i}function L(e,t,n,r){return r===`float32x2`?`${{sum:`sum_fp64`,prod:`mul_fp64`,max:`gpu_pair_max`,min:`gpu_pair_min`}[e]}(${t},${n})`:e===`sum`?`(${t}+${n})`:e===`prod`?`(${t}*${n})`:`${e}(${t},${n})`}function nt(e,n,r,i){let a=i===`float32x2`,o=t(n,0);if(e.op.name===`matvec`){let e=o.record.shape[1]??0,r=t(n,1);return{count:e,initial:a?`gpu_pair(0.0)`:`0.0`,combine:(e,t)=>L(`sum`,e,t,i),read:a?`mul_fp64(s${o.slot}[u32(${I(o.record,`i*${e}u+j`)})],s${r.slot}[u32(${I(r.record,`j`)})])`:`s${o.slot}[u32(${I(o.record,`i*${e}u+j`)})]*s${r.slot}[u32(${I(r.record,`j`)})]`}}if(!a&&e.op.name===`matmul`&&S(r.record.shape)<4096){let e=t(n,1),a=o.record.shape[1]??0,s=r.record.shape[1]??1;return{count:a,initial:`0.0`,combine:(e,t)=>L(`sum`,e,t,i),read:`s${o.slot}[u32(${I(o.record,`(i/${s}u)*${a}u+j`)})]*s${e.slot}[u32(${I(e.record,`j*${s}u+(i%${s}u)`)})]`}}let s=/^(sum|max|min|prod)\[axis=(\d+)\]$/.exec(e.op.name);if(s===null)return null;let c=s[1]??`sum`,l=Number(s[2]);if(a&&c===`prod`)return null;let u=[...r.record.shape];u.splice(l,0,1);let d={sum:a?`gpu_pair(0.0)`:`0.0`,prod:`1.0`,max:a?`-gpu_pair_inf()`:`bitcast<f32>(0xff800000u+i-i)`,min:a?`gpu_pair_inf()`:`bitcast<f32>(0x7f800000u+i-i)`};return{count:o.record.shape[l]??0,initial:d[c]??`0.0`,read:`s${o.slot}[u32(${I({...o.record,shape:u},`i`)}+i32(j)*${o.record.strides[l]})]`,combine:(e,t)=>L(c,e,t,i)}}function rt(e,t,n,r,i=`float32`){let a=nt(e,t,n,i),o=i===`float32x2`;if(a===null||a.count<(o?128:512))return null;let s=o?64:256,c=o?`vec2f`:`f32`,l=S(n.record.shape);return o&&a.count<512&&l>128?null:{groups:[Math.min(l,65535),Math.ceil(l/65535)],code:`${r}
${o?j():``}
var<workgroup> partial:array<${c},${s}>;
@compute @workgroup_size(${s}) fn main(@builtin(workgroup_id) wid:vec3<u32>,@builtin(local_invocation_index) tid:u32){
let i=wid.x+wid.y*65535u;if(i>=${l}u){return;}
var value:${c}=${a.initial};
for(var j=tid;j<${a.count}u;j+=${s}u){let x=${a.read};value=${a.combine(`value`,`x`)};}
partial[tid]=value;workgroupBarrier();
for(var stride=${s/2}u;stride>0u;stride/=2u){if(tid<stride){partial[tid]=${a.combine(`partial[tid]`,`partial[tid+stride]`)};}workgroupBarrier();}
if(tid==0u){s${n.slot}[i]=partial[0];}
}`}}const it={add:`sum_fp64(a,b)`,sub:`sub_fp64(a,b)`,mul:`mul_fp64(a,b)`,div:`div_fp64(a,b)`,neg:`-a`,square:`mul_fp64(a,a)`,sqrt:`sqrt_fp64(a)`,exp:`gpu_pair_exp(a)`,log:`gpu_pair_log(a)`,log2:`div_fp64(gpu_pair_log(a),GPU_LN2)`,log10:`div_fp64(gpu_pair_log(a),gpu_pair_log(gpu_pair(10.0)))`,reciprocal:`div_fp64(gpu_pair(1.0),a)`,abs:`gpu_pair_abs(a)`,sign:`select(gpu_pair(f32(sign_fp64(a))),a,is_nan_fp64(a))`,maximum:`gpu_pair_max(a,b)`,minimum:`gpu_pair_min(a,b)`,eq:`gpu_pair(select(0.0,1.0,!is_nan_fp64(a)&&!is_nan_fp64(b)&&compare_fp64(a,b)==0))`,neq:`gpu_pair(select(0.0,1.0,is_nan_fp64(a)||is_nan_fp64(b)||compare_fp64(a,b)!=0))`,lt:`gpu_pair(select(0.0,1.0,!is_nan_fp64(a)&&!is_nan_fp64(b)&&compare_fp64(a,b)<0))`,le:`gpu_pair(select(0.0,1.0,!is_nan_fp64(a)&&!is_nan_fp64(b)&&compare_fp64(a,b)<=0))`,gt:`gpu_pair(select(0.0,1.0,!is_nan_fp64(a)&&!is_nan_fp64(b)&&compare_fp64(a,b)>0))`,ge:`gpu_pair(select(0.0,1.0,!is_nan_fp64(a)&&!is_nan_fp64(b)&&compare_fp64(a,b)>=0))`,and:`gpu_pair(select(0.0,1.0,gpu_pair_truth(a)&&gpu_pair_truth(b)))`,or:`gpu_pair(select(0.0,1.0,gpu_pair_truth(a)||gpu_pair_truth(b)))`,switch:`select(c,b,gpu_pair_truth(a))`,clip:`gpu_pair_min(gpu_pair_max(a,b),c)`,sigmoid:`gpu_pair_sigmoid(a)`,softplus:`gpu_pair_softplus(a)`,log1p:`gpu_pair_log1p(a)`,expm1:`gpu_pair_expm1(a)`,sinh:`gpu_pair_sinh(a)`,cosh:`gpu_pair_cosh(a)`,tanh:`gpu_pair_tanh(a)`,floor:`gpu_pair_floor(a)`,ceil:`-gpu_pair_floor(-a)`,trunc:`select(gpu_pair_floor(a),-gpu_pair_floor(-a),sign_fp64(a)<0)`,pow:`gpu_pair_pow(a,b)`};function R(e,t,n){let r=n===void 0?e.record:x(e.record,n);return`s${e.slot}[u32(${I(r,t)})]`}function at(e,n,r){let i=/^(sum|max|min|prod)\[axis=(\d+)\]$/.exec(e.op.name);if(i===null)return null;let a=t(n,0),o=Number(i[2]),s=i[1],c=[...r.record.shape];c.splice(o,0,1);let l=s===`sum`?`gpu_pair(0.0)`:s===`prod`?`gpu_pair(1.0)`:s===`max`?`-gpu_pair_inf()`:`gpu_pair_inf()`,u=s===`sum`?`sum_fp64`:s===`prod`?`mul_fp64`:`gpu_pair_${s}`;return`var value=${l};for(var j=0u;j<${a.record.shape[o]}u;j++){let x=s${a.slot}[u32(${I({...a.record,shape:c},`i`)}+i32(j)*${a.record.strides[o]})];value=${u}(value,x);}`}function ot(e,n,r){if(![`matmul`,`matvec`,`outer`].includes(e.op.name))return null;let i=t(n,0),a=t(n,1),o=r.record.shape[1]??1,s=`(i/${o}u)`,c=`(i%${o}u)`;if(e.op.name===`outer`)return`let value=mul_fp64(${R(i,s)},${R(a,c)});`;let l=i.record.shape[1]??0;return`var value=gpu_pair(0.0);for(var j=0u;j<${l}u;j++){value=sum_fp64(value,mul_fp64(${R(i,`${s}*${l}u+j`)},${R(a,e.op.name===`matvec`?`j`:`j*${o}u+${c}`)}));}`}function st(e,t,n,r){let i=[.../* @__PURE__ */ new Set([...t.map(e=>e.slot),n.slot])],a=i.map((e,t)=>`@group(0) @binding(${t}) var<storage,${e===n.slot?`read_write`:`read`}> s${e}:array<vec2f>;`).join(`
`),o=rt(e,t,n,a,`float32x2`);if(o!==null)return{...o,slots:i};let s=it[e.op.name],c=s===void 0?at(e,t,n)??ot(e,t,n)??r?.replaceAll(`var value:f32=0.0`,`var value:vec2f=vec2f(0.0)`)??null:`${t.map((e,t)=>`let ${String.fromCharCode(97+t)}=${R(e,`i`,n.record.shape)};`).join(``)}let value=${s};`;if(c===null)throw Error(`You called mdl.compile_model with float32x2 operation ${e.op.name}, but this precision path needs a two-limb lowering. Use a supported model or explicitly select the Float32/CPU backend.`);return{slots:i,code:`${a}\n${j()}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${S(n.record.shape)}u){return;}${c}s${n.slot}[i]=value;}`}}const z={add:`a + b`,sub:`a - b`,mul:`a * b`,div:`a / b`,neg:`-a`,square:`a * a`,sqrt:`sqrt(a)`,exp:`exp(a)`,log:`log(a)`,log2:`log2(a)`,log10:`log(a) / log(10.0)`,pow:`pow(a, b)`,abs:`abs(a)`,sign:`sign(a)`,floor:`floor(a)`,ceil:`ceil(a)`,trunc:`trunc(a)`,reciprocal:`1.0 / a`,sin:`sin(a)`,cos:`cos(a)`,tan:`tan(a)`,tanh:`gpu_tanh(a)`,arctan:`atan(a)`,arcsin:`asin(a)`,arccos:`acos(a)`,sinh:`sinh(a)`,cosh:`cosh(a)`,arcsinh:`asinh(a)`,arccosh:`acosh(a)`,arctanh:`atanh(a)`,atan2:`atan2(a, b)`,eq:`select(0.0, 1.0, a == b)`,neq:`select(0.0, 1.0, a != b)`,lt:`select(0.0, 1.0, a < b)`,le:`select(0.0, 1.0, a <= b)`,gt:`select(0.0, 1.0, a > b)`,ge:`select(0.0, 1.0, a >= b)`,and:`select(0.0, 1.0, a != 0.0 && b != 0.0)`,or:`select(0.0, 1.0, a != 0.0 || b != 0.0)`,maximum:`max(a, b)`,minimum:`min(a, b)`,switch:`select(c, b, a != 0.0)`,clip:`clamp(a, b, c)`,sigmoid:`gpu_sigmoid(a)`,softplus:`gpu_softplus(a)`,log1p:`gpu_log1p(a)`,expm1:`gpu_expm1(a)`,erf:`gpu_erf(a)`,erfc:`gpu_erfc(a)`,erfcx:`gpu_erfcx(a)`,lgamma:`gpu_lgamma(a)`,digamma:`gpu_digamma(a)`,log1mexp:`gpu_log1mexp(a)`,xlogy:`select(a * log(b), 0.0, a == 0.0)`,xlog1py:`select(a * gpu_log1p(b), 0.0, a == 0.0)`,logaddexp:`gpu_logaddexp(a, b)`,logdiffexp:`a + gpu_log1mexp(b - a)`,normal_lcdf:`gpu_normal_lcdf((c - a) / b)`,normal_lccdf:`gpu_normal_lccdf((c - a) / b)`,log_diff_normal_cdf:`gpu_log_diff_normal_cdf(a, b, c, d)`,i0e:`gpu_i0e(a)`,i1e:`gpu_i1e(a)`,log_i0:`gpu_log_i0(a)`,ive:`gpu_ive(a, b)`},ct=`
fn gpu_log1p(x:f32)->f32 { if(abs(x)<0.01){return x*(1.0+x*(-0.5+x*(0.33333334+x*(-0.25+x*(0.2+x*(-0.16666667))))));} let y=1.0+x; if(x>1e20){return log(x);} return log(y)*(x/(y-1.0)); }
fn gpu_expm1(x:f32)->f32 { if(abs(x)<0.1){return x*(1.0+x*(0.5+x*(0.16666667+x*(0.041666668+x*(0.008333334+x*0.001388889)))));} return exp(x)-1.0; }
fn gpu_sigmoid(x:f32)->f32 { if(x>=0.0){return 1.0/(1.0+exp(-x));} let z=exp(x);return z/(1.0+z); }
fn gpu_softplus(x:f32)->f32 { return max(x,0.0)+gpu_log1p(exp(-abs(x))); }
fn gpu_tanh(x:f32)->f32 { if(abs(x)>=10.0){return sign(x);} return tanh(x); }
fn gpu_infinity(x:f32)->f32 { return bitcast<f32>(0x7f800000u+u32(min(abs(x),0.0))); }
fn gpu_nan(x:f32)->f32 { return bitcast<f32>(0x7fc00000u+u32(min(abs(x),0.0))); }
fn gpu_log1mexp(x:f32)->f32 { if(x > -0.6931471805599453){return log(-gpu_expm1(x));} return gpu_log1p(-exp(x)); }
fn gpu_logaddexp(a:f32,b:f32)->f32 { if(a==b){return a+0.6931471805599453;} return max(a,b)+gpu_log1p(exp(-abs(a-b))); }
fn gpu_erf_small(x:f32)->f32 { let z=x*x; return x*((((9.60497373987051638749*z+90.0260197203842689217)*z+2232.00534594684319226)*z+7003.32514112805075473)*z+55592.3013010394962768)/(((((z+33.5617141647503099647)*z+521.357949780152679795)*z+4594.32382970980127987)*z+22629.0000613890934246)*z+49267.3942608635921086); }
fn gpu_erfc_ratio(x:f32)->f32 { if(x<8.0){return ((((((((2.46196981473530512524e-10*x+0.564189564831068821977)*x+7.46321056442269912687)*x+48.6371970985681366614)*x+196.520832956077098242)*x+526.445194995477358631)*x+934.52852717195760754)*x+1027.55188689515710272)*x+557.535335369399327526)/((((((((x+13.2281951154744992508)*x+86.7072140885989742329)*x+354.937778887819891062)*x+975.708501743205489753)*x+1823.90916687909736289)*x+2246.33760818710981792)*x+1656.66309194161350182)*x+557.535340817727675546);} return (((((0.564189583547755073984*x+1.27536670759978104416)*x+5.01905042251180477414)*x+6.16021097993053224116)*x+7.4097426995044893916)*x+2.9788666537210024067)/((((((x+2.2605286322011727659)*x+9.39603524938001434673)*x+12.0489539808096656605)*x+17.0814450747565897222)*x+9.60896809063285878198)*x+3.3690764510008151605); }
fn gpu_erf(x:f32)->f32 { let ax=abs(x); if(ax<=1.0){return gpu_erf_small(x);} return sign(x)*(1.0-exp(-ax*ax)*gpu_erfc_ratio(ax)); }
fn gpu_erfc(x:f32)->f32 { let ax=abs(x); if(ax<1.0){return 1.0-gpu_erf_small(x);} let y=exp(-ax*ax)*gpu_erfc_ratio(ax); return select(y,2.0-y,x<0.0); }
fn gpu_erfcx_positive(x:f32)->f32 { if(x<1.0){return exp(x*x)*(1.0-gpu_erf_small(x));} if(x<1000.0){return gpu_erfc_ratio(x);} return 0.5641895835477563/x*(1.0-0.5/(x*x)); }
fn gpu_erfcx(x:f32)->f32 { if(x>=0.0){return gpu_erfcx_positive(x);} if(x < -9.3){return gpu_infinity(x);} return 2.0*exp(x*x)-gpu_erfcx_positive(-x); }
fn gpu_normal_lcdf(z:f32)->f32 { if(z < -1.0){return log(0.5*gpu_erfcx_positive(-z*0.7071067811865476))-0.5*z*z;} return gpu_log1p(-0.5*gpu_erfc(z*0.7071067811865476)); }
fn gpu_normal_lccdf(z:f32)->f32 { if(z>1.0){return log(0.5*gpu_erfcx_positive(z*0.7071067811865476))-0.5*z*z;} return gpu_log1p(-0.5*gpu_erfc(-z*0.7071067811865476)); }
fn gpu_log_diff_normal_cdf(mu:f32,sigma:f32,x:f32,y:f32)->f32 { let zx=(x-mu)/sigma*0.7071067811865476; let zy=(y-mu)/sigma*0.7071067811865476; if(zy>0.0){return -0.6931471805599453-zy*zy+log(gpu_erfcx_positive(zy)-exp(zy*zy-zx*zx)*gpu_erfcx_positive(zx));} if(zx<0.0){return -0.6931471805599453-zx*zx+log(gpu_erfcx_positive(-zx)-exp(zx*zx-zy*zy)*gpu_erfcx_positive(-zy));} return -0.6931471805599453+log(gpu_erf(zx)-gpu_erf(zy)); }
fn gpu_lgamma_stirling(x:f32)->f32 { let inverse=1.0/x; let q=inverse*inverse; let series=(((((((((-4.124946989069674e-5*q-0.00035104529814113724)*q-0.0023065379165508283)*q-0.008720909019511999)*q+0.004845911896726776)*q-0.0018461305249229)*q+0.0008398280448766838)*q-0.0005952090988257412)*q+0.0007936505752359726)*q-0.0027777777771443445)*q+0.08333333333333301; return (x-0.5)*log(x)-x+0.91893853320467274178+inverse*series; }
fn gpu_lgamma_small(x:f32)->f32 { var z=1.0; var p=0.0; var u=x; if(u>=3.0){p=-1.0;u=x-1.0;z=u;} while(u<2.0){ if(u==0.0){return gpu_infinity(x);} z=z/u; p=p+1.0; u=x+p; } z=abs(z); if(u==2.0){return log(z);} p=p-2.0; let s=x+p; return log(z)+(s*(((((-1378.251525691208591*s-38801.6315134637840924)*s-331612.992738871184744)*s-1162370.97492762307383)*s-1721737.00820839662146)*s-853555.664245765465627))/((((((s-351.815701436523470549)*s-17064.2106651881159223)*s-220528.590553854454839)*s-1139334.44367982507207)*s-2532523.07177582951285)*s-2018891.41433532773231); }
fn gpu_lgamma(x:f32)->f32 { if(x < -20.0){ let q=-x; let w=gpu_lgamma_stirling(q); var p=floor(q); if(p==q){return gpu_infinity(x);} var z=q-p; if(z>0.5){p=p+1.0;z=p-q;} z=q*sin(3.141592653589793*z); if(z==0.0){return gpu_infinity(x);} return 1.1447298858494002-log(z)-w; } if(x<4.0){return gpu_lgamma_small(x);} return gpu_lgamma_stirling(x); }
fn gpu_digamma(x:f32)->f32 { if(x==0.0){return -gpu_infinity(x);} var argument=x; var reflection=0.0; if(x<0.0){ let p=floor(x); if(p==x){return gpu_nan(x);} var fractional=x-p; if(fractional!=0.5){ if(fractional>0.5){fractional=x-(p+1.0);} reflection=3.141592653589793/tan(3.141592653589793*fractional); } argument=1.0-x; } var result=0.0; if(argument<=10.0 && argument==floor(argument)){ result=-0.57721566490153286061; for(var i=1.0;i<argument;i=i+1.0){result=result+1.0/i;} } else { var s=argument; var w=0.0; while(s<10.0){w=w+1.0/s; s=s+1.0;} var series=0.0; if(s<1e17){let z=1.0/(s*s); series=z*((((((8.33333333333333333333e-2*z-2.10927960927960927961e-2)*z+7.57575757575757575758e-3)*z-4.16666666666666666667e-3)*z+3.96825396825396825397e-3)*z-8.33333333333333333333e-3)*z+8.33333333333333333333e-2);} result=log(s)-0.5/s-series-w; } return result-reflection; }
fn gpu_bessel_series(x:f32,order:f32)->f32 { let half=abs(x)/2.0; let q=half*half; var term:f32=select(1.0,half,order>0.5); var total:f32=term; for(var k=1.0;k<200.0;k=k+1.0){term=term*q/(k*(k+order)); total=total+term; if(term<total*1e-8){break;}} return total*exp(-abs(x)); }
fn gpu_bessel_asymptotic(x:f32,order:f32)->f32 { let ax=abs(x); let mu=4.0*order*order; var term:f32=1.0; var total:f32=1.0; var previous:f32=gpu_infinity(x); for(var k=1.0;k<60.0;k=k+1.0){ term=term*(-(mu-(2.0*k-1.0)*(2.0*k-1.0))/(k*8.0*ax)); if(abs(term)>previous){break;} previous=abs(term); total=total+term; if(abs(term)<1e-8){break;}} return total*0.3989422804014327/sqrt(ax); }
fn gpu_i0e(x:f32)->f32 { if(abs(x)==gpu_infinity(x)){return 0.0;} if(abs(x)<=30.0){return gpu_bessel_series(x,0.0);} return gpu_bessel_asymptotic(x,0.0); }
fn gpu_i1e(x:f32)->f32 { if(abs(x)==gpu_infinity(x)){return 0.0;} var m:f32; if(abs(x)<=30.0){m=gpu_bessel_series(x,1.0);}else{m=gpu_bessel_asymptotic(x,1.0);} return select(m,-m,x<0.0); }
fn gpu_log_i0(x:f32)->f32 { let ax=abs(x); if(ax<1.0){ let q=ax*ax/4.0; var term:f32=1.0; var rest:f32=0.0; for(var k=1.0;k<40.0;k=k+1.0){term=term*q/(k*k); rest=rest+term; if(term<1e-9){break;}} return gpu_log1p(rest);} return log(gpu_i0e(x))+ax; }
fn gpu_ive_large(n:f32,x:f32)->f32 { let mu=4.0*n*n; var term:f32=1.0; var sum:f32=1.0; for(var k=1.0;k<=60.0;k=k+1.0){ let next=(-term*(mu-(2.0*k-1.0)*(2.0*k-1.0)))/(8.0*k*x); if(abs(next)>=abs(term) || abs(next)<=1e-8*abs(sum)){ if(abs(next)<abs(term)){sum=sum+next;} break;} sum=sum+next; term=next;} return sum/(2.5066282746310002*sqrt(x)); }
fn gpu_ive(v:f32,x:f32)->f32 { if(v!=floor(v) || abs(v)>1e6){return gpu_nan(x);} let n=abs(v); let ax=abs(x); let odd=(n-2.0*floor(n/2.0))==1.0; let sign=select(1.0,-1.0,x<0.0 && odd); if(n==0.0){return gpu_i0e(ax);} if(n==1.0){return sign*gpu_i1e(ax);} if(ax==0.0){return 0.0;} if(ax==gpu_infinity(x)){return 0.0;} if(ax>1000.0+n*n){return sign*gpu_ive_large(n,ax);} let start=max(2.0*(n+floor(sqrt(40.0*n))),ceil(sqrt(n*n+100.0*ax)))+20.0; var above:f32=0.0; var here:f32=1.0; var at_n:f32=0.0; for(var k=start;k>=1.0;k=k-1.0){ let below=above+((2.0*k)/ax)*here; above=here; here=below; if(abs(here)>1e10){let f=1.0/here;above=above*f;at_n=at_n*f;here=1.0;} if(k-1.0==n){at_n=here;}} return sign*at_n*(gpu_i0e(ax)/here); }
`,B=ct;function lt(e){return z[e]}function V(e,t,n){let r=n===void 0?e.record:x(e.record,n);return`s${e.slot}[u32(${I(r,t)})]`}function ut(e,n,r){let i=/^(sum|max|min|prod)\[axis=(\d+)\]$/.exec(e.op.name);if(i===null)return null;let a=t(n,0),o=Number(i[2]),s=[...r.shape];s.splice(o,0,1);let c={...a.record,shape:s},l={sum:`0.0`,prod:`1.0`,max:`bitcast<f32>(0xff800000u + i - i)`,min:`bitcast<f32>(0x7f800000u + i - i)`},u=i[1]??`sum`,d=u===`sum`?`value + x`:u===`prod`?`value * x`:`${u}(value, x)`;return`var value:f32=${l[u]}; for(var j=0u;j<${a.record.shape[o]}u;j++){let x=s${a.slot}[u32(${I(c,`i`)}+i32(j)*${a.record.strides[o]})];value=${d};}`}const H=4096;function U(e,t){throw Error(`You called mdl.compile_model with backend = webgpu and a ${e} over an axis of ${t} elements, but the GPU lowering serves axes of at most ${H}. Use the CPU backend for this model.`)}function dt(e,t){let n=e[t]??1,r=e.slice(t+1).reduce((e,t)=>e*t,1);return{count:n,inner:r,base:`let base=i-((i/${r}u)%${n}u)*${r}u;`}}function W(e,t,n){let{count:r,inner:i,base:a}=dt(t,n),o=t=>V(e,`base+${t}*${i}u`);return`${a}var m:f32=bitcast<f32>(0xff800000u+i-i);for(var j=0u;j<${r}u;j++){m=max(m,${o(`j`)});}var s:f32=0.0;for(var j=0u;j<${r}u;j++){s=s+exp(${o(`j`)}-m);}`}function ft(e,n,r){let i=/^softmax\[axis=(\d+)\]$/.exec(e.op.name);if(i===null)return null;let a=Number(i[1]),o=r.shape[a]??1;o>H&&U(`softmax`,o);let s=t(n,0);return`${W(s,r.shape,a)}let value=exp(${V(s,`i`)}-m)/s;`}function pt(e,n,r){let i=/^cumsum\[axis=(\d+)\]$/.exec(e.op.name);if(i===null)return null;let a=Number(i[1]),{count:o,inner:s,base:c}=dt(r.shape,a);return o>H&&U(`cumsum`,o),`${c}let last=(i/${s}u)%${o}u;var value:f32=0.0;for(var j=0u;j<=last;j++){value=value+${V(t(n,0),`base+j*${s}u`)};}`}function mt(e,n,r){let i=/^log_softmax\[axis=(\d+)\]$/.exec(e.op.name);if(i===null)return null;let a=Number(i[1]),o=t(n,0),s=t(r,0).record.shape,c=s[a]??1;c>H&&U(`log_softmax`,c);let l=S(s),u=Math.ceil(l/64);return r.map((e,t)=>{let n=[.../* @__PURE__ */ new Set([o.slot,e.slot])],r=n.map((t,n)=>`@group(0) @binding(${n}) var<storage,${t===e.slot?`read_write`:`read`}> s${t}:array<f32>;`).join(`
`),i=t===0?`let value=${V(o,`i`)}-m-log(s);`:`let value=exp(${V(o,`i`)}-m)/s;`;return{slots:n,groups:[Math.min(u,65535),Math.ceil(u/65535)],code:`${r}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${l}u){return;}${W(o,s,a)}${i}s${e.slot}[i]=value;}`}})}function ht(e,n,r){if(![`matmul`,`matvec`,`outer`].includes(e.op.name))return null;let i=t(n,0),a=t(n,1),o=r.shape[1]??1,s=`(i/${o}u)`,c=`(i%${o}u)`;if(e.op.name===`outer`)return`let value=${V(i,s)}*${V(a,c)};`;let l=i.record.shape[1]??0;return`var value:f32=0.0;for(var j=0u;j<${l}u;j++){value=value+${V(i,`${s}*${l}u+j`)}*${V(a,e.op.name===`matvec`?`j`:`j*${o}u+${c}`)};}`}function gt(e,n,r){if(e.op.name===`gpu_copy`||e.op.name.startsWith(`reshape[`))return`let value=${V(t(n,0),`i`)};`;if([`diag`,`tril`,`triu`].includes(e.op.name)){let i=r.shape[1]??1,a=t(n,0);return`var value:f32=0.0;if(i/${i}u${e.op.name===`diag`?`==`:e.op.name===`tril`?`>=`:`<=`}i%${i}u){value=${V(a,e.op.name===`diag`?`i/${i}u`:`i`)};}`}let i=e.op.fusion;if(i?.kind===`pad`)return`var value:f32=0.0;if(i>=${i.start}u && i<${i.start+i.length}u){value=${V(t(n,0),`i-${i.start}u`)};}`;let a=/^concatenate\[axis=(\d+)\]$/.exec(e.op.name);if(a===null)return null;let o=Number(a[1]),s=r.shape.slice(o+1).reduce((e,t)=>e*t,1),c=r.shape[o]??1,l=0;return`var value:f32=0.0;let c=(i/${s}u)%${c}u;${n.map(e=>{let t=e.record.shape[o]??1,n=`if(c>=${l}u && c<${l+t}u){value=${V(e,`(i/${c*s}u)*${t*s}u+(c-${l}u)*${s}u+i%${s}u`)};}`;return l+=t,n}).join(``)}`}function _t(e,t,n){let r=/^concatenate\[axis=(\d+)\]$/.exec(e.op.name);if(r===null||t.length+1<=8)return null;let i=Number(r[1]),a=n.record.shape,o=a.slice(i+1).reduce((e,t)=>e*t,1),s=a[i]??1,c=0;return t.filter(e=>S(e.record.shape)>0).map(e=>{let t=e.record.shape[i]??1,r=S(e.record.shape),a=Math.ceil(r/64),l=e.slot===n.slot?[n.slot]:[e.slot,n.slot],u=`${l.map((e,t)=>`@group(0) @binding(${t}) var<storage,${e===n.slot?`read_write`:`read`}> s${e}:array<f32>;`).join(`
`)}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let e=id.x+id.y*4194240u;if(e>=${r}u){return;}let o=e/${t*o}u;let c=(e/${o}u)%${t}u;let k=e%${o}u;let value=${V(e,`e`)};s${n.slot}[u32(${I(n.record,`o*${s*o}u+(c+${c}u)*${o}u+k`)})]=value;}`;return c+=t,{code:u,slots:l,groups:[Math.min(a,65535),Math.ceil(a/65535)]}})}function vt(e,t,n){let r=z[e.op.name];return r===void 0?ut(e,t,n)??ft(e,t,n)??pt(e,t,n)??ht(e,t,n)??gt(e,t,n):`${t.map((e,t)=>`let ${String.fromCharCode(97+t)}=${V(e,`i`,n.shape)};`).join(``)}let value=${r};`}function yt(e,t,n,r=`float32`){if(r===`float32x2`)return st(e,t,n,gt(e,t,n.record));let i=[.../* @__PURE__ */ new Set([...t.map(e=>e.slot),n.slot])],a=i.map((e,t)=>`@group(0) @binding(${t}) var<storage,${e===n.slot?`read_write`:`read`}> s${e}:array<f32>;`).join(`
`),o=rt(e,t,n,a);if(o!==null)return{...o,slots:i};let s=vt(e,t,n.record);if(s===null)throw Error(`You called mdl.compile_model with backend = webgpu and operation ${e.op.name}, but this operation needs a GPU lowering. Use the CPU backend for this model until its GPU kernel is implemented.`);return{slots:i,code:`${a}\n${ct}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${S(n.record.shape)}u){return;}${s}s${n.slot}[i]=value;}`}}function bt(e,n,r){if(e.op.name!==`eigh`||r.length!==2)return null;let i=t(n,0),a=t(r,0),o=t(r,1),s=a.record.shape[0]??0;if(S(a.record.shape)===0)return[];if(s>63)throw Error(`You called mdl.compile_model with GPU operation eigh over a ${s} x ${s} matrix, but the GPU kernel holds at most 63 rows in workgroup memory. Use the CPU backend for this model.`);let c=s+s%2,l=Math.max(1,c/2),u=Math.max(1,c-1),d=s*s,f=Math.fround(Math.sqrt(s*(s-1)/2)),p=e=>`A[u32(${I(i.record,e)})]`,m=`@group(0) @binding(0) var<storage,read> A:array<f32>;
@group(0) @binding(1) var<storage,read_write> values:array<f32>;
@group(0) @binding(2) var<storage,read_write> vectors:array<f32>;
var<workgroup> w:array<f32,${d}>;
var<workgroup> done:u32;
@compute @workgroup_size(${l}) fn main(@builtin(local_invocation_index) tid:u32){
for(var at=tid;at<${d}u;at+=${l}u){let i=at/${s}u;let j=at%${s}u;w[at]=select(0.5*${p(`i*${s}u+j`)}+0.5*${p(`j*${s}u+i`)},${p(`i*${s}u+j`)},i==j);vectors[at]=select(0.0,1.0,i==j);}
workgroupBarrier();storageBarrier();
var scale:f32=0.0;for(var at=0u;at<${d}u;at++){scale=max(scale,abs(w[at]));}
for(var sweep=0u;sweep<60u;sweep++){
if(tid==0u){var largest:f32=0.0;for(var p=0u;p<${s}u;p++){for(var q=p+1u;q<${s}u;q++){largest=max(largest,abs(w[p*${s}u+q]));}}done=select(0u,1u,largest*${f}<=1e-7*scale);}
let finished=workgroupUniformLoad(&done);
if(finished==1u){break;}
for(var r=0u;r<${u}u;r++){
var p:u32=0u;var q:u32=0u;
if(tid==0u){p=r%${u}u;q=${c-1}u;}else{p=(r+tid)%${u}u;q=(r+${u}u-tid)%${u}u;}
let valid=p<${s}u && q<${s}u;
var c:f32=1.0;var s:f32=0.0;
if(valid){let apq=w[p*${s}u+q];if(apq!=0.0){let theta=(w[q*${s}u+q]-w[p*${s}u+p])/(2.0*apq);let t=select(1.0,-1.0,theta<0.0)/(abs(theta)+sqrt(theta*theta+1.0));c=1.0/sqrt(t*t+1.0);s=t*c;}}
workgroupBarrier();
if(valid && s!=0.0){for(var k=0u;k<${s}u;k++){let apk=w[p*${s}u+k];let aqk=w[q*${s}u+k];w[p*${s}u+k]=c*apk-s*aqk;w[q*${s}u+k]=s*apk+c*aqk;}}
workgroupBarrier();
if(valid && s!=0.0){for(var k=0u;k<${s}u;k++){let akp=w[k*${s}u+p];let akq=w[k*${s}u+q];w[k*${s}u+p]=c*akp-s*akq;w[k*${s}u+q]=s*akp+c*akq;let vkp=vectors[k*${s}u+p];let vkq=vectors[k*${s}u+q];vectors[k*${s}u+p]=c*vkp-s*vkq;vectors[k*${s}u+q]=s*vkp+c*vkq;}}
workgroupBarrier();storageBarrier();
}
}
if(tid==0u){
var order:array<u32,${s}>;for(var i=0u;i<${s}u;i++){order[i]=i;}
for(var i=1u;i<${s}u;i++){let key=order[i];var j=i;for(;j>0u && w[order[j-1u]*${s}u+order[j-1u]]>w[key*${s}u+key];j--){order[j]=order[j-1u];}order[j]=key;}
for(var col=0u;col<${s}u;col++){values[col]=w[order[col]*${s}u+order[col]];}
for(var col=0u;col<${s}u;col++){let source=order[col];var largest:f32=0.0;var sign:f32=1.0;for(var k=0u;k<${s}u;k++){let entry=vectors[k*${s}u+source];if(abs(entry)>largest){largest=abs(entry);sign=select(1.0,-1.0,entry<0.0);}}for(var k=0u;k<${s}u;k++){w[k*${s}u+col]=sign*vectors[k*${s}u+source];}}
}
workgroupBarrier();storageBarrier();
for(var at=tid;at<${d}u;at+=${l}u){vectors[at]=w[at];}
}`;return[{slots:[i.slot,a.slot,o.slot],groups:[1,1],code:m}]}function xt(e,t,n){let r=e<0?e+t:e;if(r<0||r>=t)throw Error(`You called mdl.compile_model with GPU operation ${n} and index ${e} on an axis of length ${t}, but indices must be in [${-t}, ${t-1}]. Pass indices in that range.`);return r}function St(e,t,n,r){if(!Number.isInteger(e.axis)||e.axis<0||e.axis>=t.shape.length)throw Error(`You called mdl.compile_model with GPU operation ${r} and axis ${e.axis}, but the axis must be an integer in [0, ${t.shape.length-1}]. Pass an axis in that range.`);let i=e.indices_shape===void 0?t.shape.map((t,n)=>n===e.axis?e.indices.length:t):ue(t.shape,e.indices_shape,e.axis);if(n.shape.length!==i.length||n.shape.some((e,t)=>e!==i[t])||e.indices_shape!==void 0&&S(e.indices_shape)!==e.indices.length)throw Error(`You called mdl.compile_model with GPU operation ${r}, but its values and index-array shapes do not match the gather shape [${i.join(`, `)}]. Pass matching values and static indices.`)}function Ct(e,t,n){let r=new Uint32Array(n+1);for(let t of e)r[t+1]=(r[t+1]??0)+1;for(let e=1;e<=n;e++)r[e]=(r[e]??0)+(r[e-1]??0);let i=new Uint32Array(r.length+e.length);i.set(r);let a=r.slice();for(let n=0;n<e.length;n++){let o=e[n]??0,s=a[o]??0;i[r.length+s]=t[n]??0,a[o]=s+1}return i}function wt(e,t,n,r){let i=S(t.slice(n+1)),a=`(i/${(t[n]??1)*i}u)*${i}u+i%${i}u`,o=[...t];return o[n]=1,`u32(${I({...e,shape:o},a)}+i32(${r})*${e.strides[n]})`}function Tt(e,t,n,r){let i=e.kind===`take`?t:n,a=i.shape[e.axis]??0,o=Uint32Array.from(e.indices,e=>xt(e,a,r)),s=e.kind===`take`?n.shape:i.shape,c=`(i/${S(s.slice(e.axis+1))}u)%${s[e.axis]??0}u`;return e.kind===`take`?{indices:o,address:wt(t,s,e.axis,`idx[${c}]`),target:null}:{indices:Ct(o,Uint32Array.from(o,(e,t)=>t),a),address:wt(t,s,e.axis,`idx[${a+1}u+j]`),target:c}}function Et(e,t,n,r){let i=e.indices_shape??[],a=S(n.shape),s=new Uint32Array(a),c=new Uint32Array(a),l=o(i);for(let o=0;o<a;o++){let a=o,u=t.offset,d=n.offset,f=0;for(let r=n.shape.length-1;r>=0;r--){let o=n.shape[r]??1,s=a%o;a=Math.floor(a/o),d+=s*(n.strides[r]??0),i[r]!==1&&(f+=s*(l[r]??0)),r!==e.axis&&t.shape[r]!==1&&(u+=s*(t.strides[r]??0))}u+=xt(e.indices[f]??0,t.shape[e.axis]??0,r)*(t.strides[e.axis]??0),s[o]=u,c[o]=d}return{sources:s,values:c}}function Dt(e,t,n,r){let{sources:i,values:a}=Et(e,e.kind===`take`?t:n,e.kind===`take`?n:t,r);if(e.kind===`take`)return{indices:i,address:`idx[i]`,target:null};let o=S(n.shape)+1;return{indices:Ct(i,a,o-1),address:`idx[${o}u+j]`,target:`i`}}function Ot(e,t,n){let r=e.op.placement_of?.(n);if(r===void 0)return null;if(t.shape.length!==r.shape.length||t.shape.some((e,t)=>e!==r.shape[t]))throw Error(`You called mdl.compile_model with GPU operation ${e.op.name}, but its input must match the selected output region. Pass an input of shape [${r.shape.join(`, `)}].`);let i=new Uint32Array(S(n.shape)).fill(4294967295);for(let e=0;e<S(t.shape);e++)i[l(r,e)]=l(t,e);return{indices:i,address:`idx[i]`,target:null,masked:!0}}function kt(e,n,r,i=`float32`){let a=e.op.indexing,o=e.op.placement_of!==void 0&&e.op.fusion?.kind!==`pad`;if(a===void 0&&!o)return null;let s=t(n,0);a!==void 0&&St(a,a.kind===`take`?s.record:r.record,a.kind===`take`?r.record:s.record,e.op.name);let c=a===void 0?Ot(e,s.record,r.record):a.indices_shape===void 0?Tt(a,s.record,r.record,e.op.name):Dt(a,s.record,r.record,e.op.name);if(c===null)return null;let l=i===`float32x2`,u=[s.slot,r.slot],d=l?`vec2f`:`f32`,f=`s${s.slot}[${c.address}]`,p=l?`vec2f(0.0)`:`0.0`,m=c.target===null?`masked`in c?`var value:${d}=${p};if(idx[i]!=0xffffffffu){value=${f};}`:`let value=${f};`:`var value:${d}=${p};let destination=${c.target};for(var j=idx[destination];j<idx[destination+1u];j++){value=${l?`sum_fp64(value,${f})`:`value+${f}`};}`,h=Math.ceil(S(r.record.shape)/64);return{slots:u,indices:c.indices,groups:[Math.min(h,65535),Math.ceil(h/65535)],code:`${l?j():``}
@group(0) @binding(0) var<storage,read> s${s.slot}:array<${d}>;
@group(0) @binding(1) var<storage,read_write> s${r.slot}:array<${d}>;
@group(0) @binding(2) var<storage,read> idx:array<u32>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${S(r.record.shape)}u){return;}${m}s${r.slot}[i]=value;}`}}function G(e){let t=e===`float32x2`,n=(e,n)=>(r,i)=>t?`${e}(${r},${i})`:`(${r}${n}${i})`;return{type:t?`vec2f`:`f32`,zero:t?`vec2f(0.0)`:`0.0`,one:t?`vec2f(1.0,0.0)`:`1.0`,support:t?j():``,mul:n(`mul_fp64`,`*`),sub:n(`sub_fp64`,`-`),div:n(`div_fp64`,`/`),sqrt:e=>t?`sqrt_fp64(${e})`:`sqrt(${e})`,positive:t?`sign_fp64(pivot)>0 && !is_nan_fp64(pivot)`:`pivot>0.0`,nan:t?`vec2f(bitcast<f32>(0x7fc00000u+i-i),0.0)`:`bitcast<f32>(0x7fc00000u+i-i)`}}function K(e){let t=Math.ceil(e/64);return[Math.min(t,65535),Math.ceil(t/65535)]}function At(e,t,n,r,i){let a=G(i);return{slots:[e.slot,t.slot,n],groups:K(r*r),code:`${a.support}
@group(0) @binding(0) var<storage,read> A:array<${a.type}>;
@group(0) @binding(1) var<storage,read_write> L:array<${a.type}>;
@group(0) @binding(2) var<storage,read_write> status:array<u32>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){
let i=id.x+id.y*4194240u;if(i>=${r*r}u){return;}if(i==0u){status[0]=0u;}
L[i]=select(${a.zero},A[u32(${I(e.record,`i`)})],i/${r}u>=i%${r}u);
}`}}function jt(e,t,n,r,i,a){let o=G(a);return{slots:[e.slot,t],groups:[1,1],code:`${o.support}
@group(0) @binding(0) var<storage,read_write> L:array<${o.type}>;
@group(0) @binding(1) var<storage,read_write> status:array<u32>;
var<workgroup> tile:array<${o.type},1024>;
@compute @workgroup_size(256) fn main(@builtin(local_invocation_index) tid:u32){
for(var at=tid;at<1024u;at+=256u){let row=at/32u;let col=at%32u;tile[at]=${o.zero};if(row<${i}u && col<=row){tile[at]=L[(${r}u+row)*${n}u+${r}u+col];}}
workgroupBarrier();
for(var j=0u;j<${i}u;j++){
if(tid==0u){let pivot=tile[j*32u+j];if(!(${o.positive})){status[0]=1u;tile[j*32u+j]=${o.one};}else{tile[j*32u+j]=${o.sqrt(`pivot`)};}}
workgroupBarrier();
if(tid>0u+j && tid<${i}u){tile[tid*32u+j]=${o.div(`tile[tid*32u+j]`,`tile[j*32u+j]`)};}
workgroupBarrier();
for(var at=tid;at<1024u;at+=256u){let row=at/32u;let col=at%32u;if(row<${i}u && row>=col && col>j){tile[at]=${o.sub(`tile[at]`,o.mul(`tile[row*32u+j]`,`tile[col*32u+j]`))};}}
workgroupBarrier();
}
for(var at=tid;at<1024u;at+=256u){let row=at/32u;let col=at%32u;if(row<${i}u && col<=row){L[(${r}u+row)*${n}u+${r}u+col]=tile[at];}}
}`}}function Mt(e,t,n,r,i){let a=G(i),o=n+r;return{slots:[e.slot],groups:K(t-o),code:`${a.support}
@group(0) @binding(0) var<storage,read_write> L:array<${a.type}>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){
let row=id.x+id.y*4194240u+${o}u;if(row>=${t}u){return;}
for(var j=${n}u;j<${o}u;j++){var value=L[row*${t}u+j];for(var k=${n}u;k<j;k++){value=${a.sub(`value`,a.mul(`L[row*${t}u+k]`,`L[j*${t}u+k]`))};}L[row*${t}u+j]=${a.div(`value`,`L[j*${t}u+j]`)};}
}`}}function Nt(e,t,n,r){let i=n+r,a=t-i,o=i*t+n,s=i*t+i,c=`const params:Params=Params(${a}u,${a}u,${r}u,-1.0,1.0,${t}u,${t}u,${t}u,0u,1u,0u,0u);`,l=M.replace(/^@group\(0\) @binding\([0-3]\).*\n/gm,``).replace(`@binding(4)`,`@binding(0)`).replace(`@group(0) @binding(5) var<uniform> params: Params;`,c).replace(/\b[AB]\[([^\]]+)\]/g,`C[${o}u+($1)]`).replace(/\b[AB]4\[([^\]]+)\]/g,`read_vec(($1)*4u)`).replace(/C\[cIdx\]/g,`C[${s}u+cIdx]`);return{slots:[e.slot],groups:[Math.ceil(a/32),Math.ceil(a/32)],code:`${l}
fn read_vec(at:u32)->vec4<f32>{return vec4<f32>(C[at],C[at+1u],C[at+2u],C[at+3u]);}`}}function Pt(e,t,n,r){let i=n+r,a=t-i;return{slots:[e.slot],groups:K(a*a),code:`${j()}
@group(0) @binding(0) var<storage,read_write> L:array<vec2f>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){
let i=id.x+id.y*4194240u;if(i>=${a*a}u){return;}let row=i/${a}u+${i}u;let col=i%${a}u+${i}u;if(col>row){return;}
var value=L[row*${t}u+col];for(var k=${n}u;k<${i}u;k++){value=sub_fp64(value,mul_fp64(L[row*${t}u+k],L[col*${t}u+k]));}L[row*${t}u+col]=value;
}`}}function Ft(e,t,n,r){let i=G(r);return{slots:[e.slot,t],groups:K(n*n),code:`${i.support}
@group(0) @binding(0) var<storage,read_write> L:array<${i.type}>;
@group(0) @binding(1) var<storage,read> status:array<u32>;
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){
let i=id.x+id.y*4194240u;if(i>=${n*n}u){return;}
if(status[0]!=0u){L[i]=${i.nan};}else if(i/${n}u<i%${n}u){L[i]=${i.zero};}
}`}}function It(e,n,r,i){let a=G(i),o=t(e,0),s=t(e,1),c=o.record.shape[0]??0,l=s.record.shape[1]??1,u=[.../* @__PURE__ */ new Set([o.slot,s.slot,n.slot])],d=u.map((e,t)=>`@group(0) @binding(${t}) var<storage,${e===n.slot?`read_write`:`read`}> s${e}:array<${a.type}>;`).join(`
`);if(i===`float32x2`&&c>0&&c<=2048){let e=c<=1024,t=r?`${c-1}u-step`:`step`,i=r?`row<pivot`:`row>pivot`,f=r?`pivot*${c}u+row`:`row*${c}u+pivot`;return{slots:u,groups:K(l*64),code:`${d}
${a.support}
var<workgroup> rhs:array<vec2f,${c}>;
${e?`var<workgroup> inv:array<vec2f,${c}>;`:``}
@compute @workgroup_size(64) fn main(@builtin(workgroup_id) group:vec3<u32>,@builtin(local_invocation_index) lane:u32){
let column=group.x+group.y*65535u;if(column>=${l}u){return;}
for(var row=lane;row<${c}u;row+=64u){rhs[row]=s${s.slot}[u32(${I(s.record,`row*${l}u+column`)})];${e?`let diagonal=s${o.slot}[u32(${I(o.record,`row*${c}u+row`)})];if(abs(diagonal.x)>8.673617379884035e-19 && abs(diagonal.x)<1.152921504606847e18){inv[row]=div_fp64(vec2f(1.0,0.0),diagonal);}else{inv[row]=vec2f(0.0);}`:``}}
workgroupBarrier();
for(var step=0u;step<${c}u;step++){let pivot=${t};
if(lane==0u){${e?`if(inv[pivot].x!=0.0){rhs[pivot]=mul_fp64(rhs[pivot],inv[pivot]);}else{rhs[pivot]=div_fp64(rhs[pivot],s${o.slot}[u32(${I(o.record,`pivot*${c}u+pivot`)})]);}`:`rhs[pivot]=div_fp64(rhs[pivot],s${o.slot}[u32(${I(o.record,`pivot*${c}u+pivot`)})]);`}}
workgroupBarrier();
let solved=rhs[pivot];
for(var row=lane;row<${c}u;row+=64u){if(${i}){rhs[row]=sub_fp64(rhs[row],mul_fp64(s${o.slot}[u32(${I(o.record,f)})],solved));}}
workgroupBarrier();
}
for(var row=lane;row<${c}u;row+=64u){s${n.slot}[row*${l}u+column]=rhs[row];}
}`}}let f=r?`${c-1}u-step`:`step`,p=r?`row+1u;k<${c}u`:`0u;k<row`,m=r?`k*${c}u+row`:`row*${c}u+k`;return{slots:u,groups:K(l),code:`${d}
${a.support}
@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){
let column=id.x+id.y*4194240u;if(column>=${l}u){return;}
for(var step=0u;step<${c}u;step++){let row=${f};
var value=s${s.slot}[u32(${I(s.record,`row*${l}u+column`)})];
for(var k=${p};k++){value=${a.sub(`value`,a.mul(`s${o.slot}[u32(${I(o.record,m)})]`,`s${n.slot}[k*${l}u+column]`))};}
s${n.slot}[row*${l}u+column]=${a.div(`value`,`s${o.slot}[u32(${I(o.record,`row*${c}u+row`)})]`)};
}}
`}}function Lt(e,n){let r=e.filter(e=>e.op.name===`cholesky`),i=n.length;return n.push(...r.map(()=>1)),new Map(r.map((e,n)=>[t(e.outputs,0).id,i+n]))}function Rt(e,n,r,i,a=`float32`){if(e.op.name.startsWith(`solve_lower_triangular`))return[It(n,r,e.op.name.endsWith(`transposed`),a)];if(e.op.name!==`cholesky`)return null;if(i===void 0)throw Error(`You called mdl.compile_model with a missing Cholesky status buffer, but GPU factorization needs a scratch flag. Recompile the complete model graph.`);let o=r.record.shape[0]??0;if(o===0)return[];let s=[At(t(n,0),r,i,o,a)];for(let e=0;e<o;e+=32){let t=Math.min(32,o-e);s.push(jt(r,i,o,e,t,a)),e+t<o&&s.push(Mt(r,o,e,t,a),a===`float32`?Nt(r,o,e,t):Pt(r,o,e,t))}return s.push(Ft(r,i,o,a)),s}function zt(e,n,r){let i=new Set(n.map(e=>e.id));for(let t of e)for(let e of t.inputs)i.add(e.id);let a=/* @__PURE__ */ new Map;for(let n of e){if(n.op.recurrence?.kind!==`backward`)continue;let e=n.outputs.map(e=>i.has(e.id)),o=n.outputs.reduce((t,n,r)=>t+(e[r]===!0?S(n.shape):0),0);a.set(t(n.outputs,0).id,{slot:r.length,written:e}),r.push(Math.max(1,o))}return a}function q(e,t,n){let r=e.records.get(t.id);if(r===void 0||r.slot<0)throw Error(`You called mdl.compile_model with GPU operation ${n}, but a value of its step has no storage. Use the CPU backend for this model until its GPU kernel is implemented.`);return r}const J=(e,t)=>`s${e.slot}[u32(${I(e.record,t)})]`,Y=(e,t)=>`g${e.slot}[u32(${I(e.record,t)})]`,X=(e,t)=>`for(var j=0u;j<${e}u;j++){${t}}`;function Bt(e,t){let n=Math.fround(e);if(!Number.isFinite(n))throw Error(`You called mdl.compile_model with GPU operation ${t}, but a constant of its step is ${String(e)}, which Float32 cannot hold. Use the CPU backend for this model, or write the step over constants Float32 holds.`);let r=String(n);return/[.e]/.test(r)?r:`${r}.0`}function Vt(e,t){let n=/* @__PURE__ */ new Map;for(let r of[...e.layouts.applies.flatMap(e=>[...e.inputs]),...e.outputs]){let i=r.constant_value;if(r.producer!==null||i===null)continue;let a=q(e.layouts,r,t),o=Array.from(tt(i),e=>Bt(e,t));n.set(a.slot,`=array<f32,${Math.max(1,o.length)}>(${o.length===0?`0.0`:o.join(`,`)})`)}return e.layouts.sizes.map((e,t)=>`var s${t}:array<f32,${Math.max(1,e)}>${n.get(t)??``};`).join(``)}function Ht(e,t,n){let r=e.op.placement_of?.(n.record);return r===void 0?null:`${X(S(n.record.shape),`s${n.slot}[j]=0.0;`)}${X(S(t.record.shape),`s${n.slot}[u32(${I(r,`j`)})]=${J(t,`j`)};`)}`}function Ut(e,n){let r=[];for(let i of e.layouts.applies){let a=t(i.outputs,0);if(e.layouts.aliases.has(a.id)||S(a.shape)===0)continue;if(i.outputs.length!==1||i.op.indexing!==void 0)throw Error(`You called mdl.compile_model with GPU operation ${n} whose step uses ${i.op.name}, but this operation needs a GPU lowering inside a recurrence. Use the CPU backend for this model until its GPU kernel is implemented.`);let o=i.inputs.map(t=>q(e.layouts,t,n)),s=q(e.layouts,a,n),c=Ht(i,t(o,0),s);if(c!==null){r.push(c);continue}let l=vt(i,o,s.record);if(l===null)throw Error(`You called mdl.compile_model with GPU operation ${n} whose step uses ${i.op.name}, but this operation needs a GPU lowering. Use the CPU backend for this model until its GPU kernel is implemented.`);r.push(`for(var i=0u;i<${S(s.record.shape)}u;i++){${l}s${s.slot}[i]=value;}`)}return r.join(``)}function Wt(e,t,n){let r=[.../* @__PURE__ */ new Set([...e,t])];if(r.length>8)throw Error(`You called mdl.compile_model with GPU operation ${n} over ${r.length} buffers, but one GPU kernel binds at most 8. Use the CPU backend for this model, or write the step over fewer distinct inputs.`);return{slots:r,code:r.map((e,n)=>`@group(0) @binding(${n}) var<storage,${e===t?`read_write`:`read`}> g${e}:array<f32>;`).join(`
`)}}function Gt(e,n,r,i){return r.map((r,a)=>{let o=q(n.layouts,t(e.inputs,1+a),i),s=S(o.record.shape);return X(s,`s${o.slot}[j]=${Y(r,`t*${s}u+j`)};`)}).join(``)}function Kt(e,n,r,i){return r.map((r,a)=>{let o=q(n.layouts,t(e.inputs,1+e.n_elements+a),i);return X(S(o.record.shape),`s${o.slot}[j]=${Y(r,`j`)};`)}).join(``)}function qt(e,n,r,i,a){let o=e.op.name,s=n.n_elements,c=q(a.layouts,t(n.inputs,0),o),l=q(a.layouts,t(a.outputs,0),o),u=S(c.record.shape),d=Wt(r.map(e=>e.slot),i.slot,o),f=[`var carry:array<f32,${Math.max(1,u)}>;`,Kt(n,a,r.slice(1+s),o),X(u,`s${c.slot}[j]=${Y(t(r,0),`j`)};`),`for(var t=0u;t<${n.length}u;t++){`,Gt(n,a,r.slice(1,1+s),o),Ut(a,o),X(u,`carry[j]=${J(l,`j`)};`),X(u,`s${c.slot}[j]=carry[j];g${i.slot}[u32(${I(i.record,`t*${u}u+j`)})]=carry[j];`),`}`].join(``);return{slots:d.slots,groups:[1,1],code:`${d.code}\n${B}\n@compute @workgroup_size(1) fn main(){${Vt(a,o)}${f}}`}}function Jt(e,t){let n=0;return e.map((e,r)=>{if(t[r]!==!0)return-1;let i=n;return n+=S(e.record.shape),i})}function Yt(e,n,r,i,a,o){let s=e.op.name,c=n.n_elements,[l,u,d]=[t(r,0),t(r,1),t(r,2)],f=q(a.layouts,t(n.inputs,0),s),p=q(a.layouts,t(n.inputs,n.inputs.length-1),s),m=a.outputs.map(e=>q(a.layouts,e,s)),h=S(f.record.shape),g=Jt(i,o.written),_=Wt(r.map(e=>e.slot),o.slot,s),v=i.slice(1+c).map((e,n)=>({at:g[1+c+n]??-1,size:S(e.record.shape),result:t(m,1+c+n)})),y=v.map((e,t)=>e.at<0?``:`var a${t}:array<f32,${Math.max(1,e.size)}>;`).join(``),b=n.inputs.slice(1,1+c).map((e,n)=>{let r=g[1+n]??-1,i=S(e.shape);return r<0?``:X(i,`g${o.slot}[${r}u+t*${i}u+j]=${J(t(m,1+n),`j`)};`)}).join(``),x=[`var carry:array<f32,${Math.max(1,h)}>;`,y,Kt(n,a,r.slice(3+c),s),`for(var t=${n.length}u;t>0u;){t=t-1u;`,X(h,`s${p.slot}[j]=${Y(l,`t*${h}u+j`)}+carry[j];`),`if(t==0u){${X(h,`s${f.slot}[j]=${Y(d,`j`)};`)}}else{${X(h,`s${f.slot}[j]=${Y(u,`(t-1u)*${h}u+j`)};`)}}`,Gt(n,a,r.slice(3,3+c),s),Ut(a,s),X(h,`carry[j]=${J(t(m,0),`j`)};`),b,v.map((e,t)=>e.at<0?``:X(e.size,`a${t}[j]=a${t}[j]+${J(e.result,`j`)};`)).join(``),`}`,(g[0]??-1)<0?``:X(h,`g${o.slot}[${g[0]}u+j]=carry[j];`),v.map((e,t)=>e.at<0?``:X(e.size,`g${o.slot}[${e.at}u+j]=a${t}[j];`)).join(``)].join(``);return{slots:_.slots,groups:[1,1],code:`${_.code}\n${B}\n@compute @workgroup_size(1) fn main(){${Vt(a,s)}${x}}`}}function Xt(e,t){let n=Jt(e,t.written),r=e.map((e,t)=>({output:e,at:n[t]??-1})).filter(e=>e.at>=0),i=[];for(let e=0;e<r.length;e+=7){let n=r.slice(e,e+8-1),a=[t.slot,...n.map(e=>e.output.slot)],o=a.map((e,t)=>`@group(0) @binding(${t}) var<storage,${t===0?`read`:`read_write`}> g${e}:array<f32>;`).join(`
`),s=0,c=n.map(e=>{let n=S(e.output.record.shape),r=`if(i<${s+n}u){g${e.output.slot}[i-${s}u]=g${t.slot}[${e.at}u+i-${s}u];return;}`;return s+=n,r}),l=Math.ceil(s/64);i.push({slots:a,groups:[Math.min(l,65535),Math.ceil(l/65535)],code:`${o}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${s}u){return;}${c.join(``)}}`})}return i}function Zt(e,n,r,i,a){let o=e.op.recurrence;if(o===void 0)return null;let s=le(o.outputs,o.inputs).outputs,c={layouts:a(s,o.inputs),outputs:s};if(o.kind===`forward`)return[qt(e,o,n,t(r,0),c)];if(i===void 0)throw Error(`You called mdl.compile_model with GPU operation ${e.op.name}, but its gradients have no packed buffer. Recompile the complete model graph.`);return[Yt(e,o,n,r,c,i),...Xt(r,i)]}function Qt(e,n,r,i,a,o){let s=t(e.outputs,0),c=t(r,0),l=a===`float32`?Zt(e,n,r,i.packs.get(s.id),o):null,u=e.outputs.length===1||a!==`float32`?null:mt(e,n,r)??l??bt(e,n,r);if(e.op.name.startsWith(`ode[`))throw Error(`You called mdl.compile_model with backend = webgpu and operation ${e.op.name}, but an ODE solve needs a tolerance Float32 cannot meet: the stepper's error estimate never falls below rtol or atol under 6e-8, so every step is rejected. Use the CPU backend for a model with an ODE.`);if(e.outputs.length!==1&&u===null)throw Error(`You called mdl.compile_model with GPU operation ${e.op.name}, but this lowering requires one output in the ${a} precision. Use precision = float32, or the CPU backend, for this model.`);let d=kt(e,n,c,a);if(S(s.shape)===0)return[];let f=a===`float32`&&e.op.name===`matmul`?et(n,c,i.scratch.get(s.id)):null,p=a===`float32`?_t(e,n,c):null;return u??l??Rt(e,n,c,i.status.get(s.id),a)??f??p??(d===null?null:[d])}function $t(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}function en(e){let n=new Map(e.map(e=>[t(e.outputs,0).id,e])),r=[],i=/* @__PURE__ */ new Set,a=e=>{if(!i.has(e)){i.add(e);for(let t of e.inputs){let e=n.get(t.id);e!==void 0&&a(e)}r.push(e)}};for(let t of e)a(t);return r}function tn(e,n,r){let i=new Set(e.map(e=>t(e.outputs,0).id)),a=/* @__PURE__ */ new Map;for(let t of e)for(let e of t.inputs)i.has(e.id)||a.set(e.id,e);let o=new Set(n.flatMap(e=>e.inputs.map(e=>e.id))),s=e.map(e=>t(e.outputs,0)).filter(e=>r(e)||o.has(e.id));return{inputs:[...a.values()],outputs:s}}function nn(e,n,r){let i=en(e),a=/* @__PURE__ */ new Set,o=[],s=[];for(let e of i){let r=t(e.outputs,0);!(e.outputs.length===1&&lt(e.op.name)!==void 0&&$t(r.shape,n))||e.inputs.some(e=>a.has(e.id))?(a.add(r.id),s.push(e)):o.push(e)}if(o.length===0)return[];let c=[],l=[],u=e=>[...o.filter(t=>!e.includes(t)),...s];for(let e of o){let t=[...l,e],{inputs:n,outputs:i}=tn(t,u(t),r);n.length+i.length>8&&l.length>0?(c.push(l),l=[e]):l=t}return c.push(l),c.map((e,t)=>({members:e,loop_shape:n,...tn(e,u(e),r),rest:t===c.length-1?s:[]}))}function rn(e,n){let r=[],i=/* @__PURE__ */ new Set,a=e=>{let t=r.indexOf(e);return t>=0?t:(r.push(e),r.length-1)},o=/* @__PURE__ */ new Map,s=[];for(let t of e.inputs){let r=n(t);o.set(t.id,`x${t.id}`),s.push(`let x${t.id}=b${a(r.slot)}[u32(${I(x(r.record,e.loop_shape),`i`)})];`)}let c=new Set(e.outputs.map(e=>e.id));for(let r of e.members){let e=t(r.outputs,0),l=(lt(r.op.name)??``).replace(/\b([abcd])\b/g,(e,n)=>o.get(t(r.inputs,n.charCodeAt(0)-97).id)??``);if(o.set(e.id,`v${e.id}`),s.push(`let v${e.id}=${l};`),c.has(e.id)){let t=n(e),r=a(t.slot);i.add(r),s.push(`b${r}[u32(${I(t.record,`i`)})]=v${e.id};`)}}let l=r.map((e,t)=>`@group(0) @binding(${t}) var<storage,${i.has(t)?`read_write`:`read`}> b${t}:array<f32>;`).join(`
`),u=S(e.loop_shape),d=Math.ceil(u/64);return{slots:r,groups:[Math.min(d,65535),Math.ceil(d/65535)],code:`${l}\n${B}\n@compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id:vec3<u32>){let i=id.x+id.y*4194240u;if(i>=${u}u){return;}${s.join(``)}}`}}function an(e,n,r,i,a){for(let o of n){if(o.constant_value===null)continue;let n=r.records.get(o.id)?.slot;n!==void 0&&S(o.shape)>0&&e.queue.writeBuffer(t(i,n),0,tt(o.constant_value,a))}}function on(e,t){let n=e.map(e=>S(e.shape));return{sizes:n,bytes:Math.max(4,n.reduce((e,n)=>e+n*4*A(t),0))}}function sn(e,n){let r=[];return{outputs:e.map(e=>{let i=n.records.get(e.id)?.record;if(i?.offset===0&&i.strides.every((t,n)=>t===F(e.shape).strides[n]))return e;let a=b(e.shape),o=c({name:`gpu_copy`,infer_shape:()=>e.shape,grad:null,perform_into:(e,n)=>{u(e,t(n,0))}});return r.push({op:o,inputs:[e],outputs:[a]}),n.records.set(a.id,{slot:n.sizes.length,record:F(e.shape)}),n.sizes.push(S(e.shape)),a}),copies:r}}function Z(e,t,n){let r=n.trim()===``?``:` (${n.trim()})`;return Error(t===`out-of-memory`?`You called ${e} with backend = webgpu, but the GPU device could not allocate the model's buffers${r}. Use precision = float32 or a smaller model, or omit backend to run on the CPU.`:t===`lost`?`You called ${e} with backend = webgpu, but the GPU device was lost${r}. Compile the model again on a new device, or omit backend to run on the CPU.`:`You called ${e} with backend = webgpu, but the GPU device rejected TyMC's commands${r}. Omit backend to run on the CPU, and report the model with this message.`)}function cn(e,t){let n,r=e=>n??=e,i=e.lost.then(e=>{throw r(Z(t,`lost`,e.message===``?e.reason:e.message))});i.catch(()=>void 0);let a=e=>{r(Z(t,ln(e.error),e.error.message))};e.addEventListener(`uncapturederror`,a);let o=()=>{if(n!==void 0)throw n},s=async n=>{o(),e.pushErrorScope(`internal`),e.pushErrorScope(`out-of-memory`),e.pushErrorScope(`validation`);let i,a;try{i={value:await n()}}catch(e){a=e}let[s,c,l]=await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()]);if(c)throw r(Z(t,`out-of-memory`,c.message));if(s)throw r(Z(t,`validation`,s.message));if(l)throw r(Z(t,`internal`,l.message));if(i===void 0)throw a;return o(),i.value},c=async e=>{o();try{await Promise.race([e.mapAsync(1),i])}catch(e){throw o(),e}if(n!==void 0)throw e.unmap(),n};return{scoped:s,map:c,round_trip:async(e,t)=>{let[n,r]=await Promise.allSettled([s(e),c(t)]);if(n.status===`rejected`)throw r.status===`fulfilled`&&t.unmap(),n.reason;if(r.status===`rejected`)throw r.reason},check:o,close:()=>e.removeEventListener(`uncapturederror`,a)}}function ln(e){let t=e.constructor.name;return t===`GPUOutOfMemoryError`?`out-of-memory`:t===`GPUInternalError`?`internal`:`validation`}function un(e,t,n){let r=/* @__PURE__ */ new Map;for(let e of t)for(let t of e.inputs)r.set(t.id,[...r.get(t.id)??[],e]);let i=/* @__PURE__ */ new Map;for(let t of e){if(t.kind!==`cluster`)continue;let e=nn(t.members,t.loop_shape,e=>n.includes(e)||(r.get(e.id)??[]).some(e=>!t.members.includes(e)));e.length>0&&i.set(t,e)}return i}function dn(e,t){return e.flatMap(e=>{let n=e.kind===`cluster`?t.get(e):void 0;return n===void 0?e.kind===`cluster`?e.members:[e.apply]:n.flatMap(e=>[{op:c({name:`fused`,infer_shape:()=>e.loop_shape,grad:null,perform_into:e=>e}),inputs:e.inputs,outputs:e.outputs},...e.rest])})}function Q(e,n,r){let i=r?ne(y(e,n)):y(e,n).map(e=>({kind:`apply`,apply:e})),a=i.flatMap(e=>e.kind===`cluster`?e.members:[e.apply]),o=un(i,a,e),s=dn(i,o),c=/* @__PURE__ */ new Map,l=[],u=/* @__PURE__ */ new Map;for(let t of[...n,...a.flatMap(e=>[...e.inputs]),...e])if(!(t.producer!==null||c.has(t.id))){if(t.constant_value===null&&!n.includes(t))throw Error(`You called mdl.compile_model with an unbound graph input, but every free input must be a model parameter. Bind the missing input in the model.`);c.set(t.id,{slot:l.length,record:F(t.shape)}),l.push(S(t.shape))}for(let e of a){if(e.outputs.length!==1||e.op.view_of===void 0)continue;let n=t(e.inputs,0),r=t(e.outputs,0),i=c.get(n.id)??{slot:-1,record:F(n.shape)},a=e.op.view_of(i.record,r.shape);a!==null&&(u.set(r.id,u.get(n.id)??n.id),c.set(r.id,{slot:i.slot,record:a}))}let d=s.map(e=>({...e,op:{...e.op,output_may_alias_input:e.outputs.map(()=>[])}})),f=pe(d,e,n,{alias_root:u}),p=l.length;l.push(...f.buffer_sizes);for(let e of a)for(let t of e.outputs){if(u.has(t.id))continue;let e=f.assignment.get(t.id);c.set(t.id,{slot:e===void 0?-1:p+e,record:F(t.shape)})}for(let[e,t]of u){let n=c.get(e),r=c.get(t);n!==void 0&&r!==void 0&&c.set(e,{slot:r.slot,record:n.record})}return{records:c,sizes:l,aliases:u,applies:a,status:Lt(a,l),scratch:Ye(a,c,l,r),packs:zt(a,e,l),schedule:i,plans:o}}function fn(e,t,n){let r=Math.max(4*A(n),t*4*A(n));if(r>e.limits.maxStorageBufferBindingSize)throw Error(`You called mdl.compile_model with a GPU tensor of ${r} bytes, but the device storage-binding limit is ${e.limits.maxStorageBufferBindingSize} bytes. Use a smaller tensor or the CPU backend.`);return e.createBuffer({size:r,usage:140})}function pn(e,t){let n=e.records.get(t.id);if(n===void 0)throw Error(`You called mdl.compile_model with a missing GPU layout, but every graph variable needs storage. Recompile the complete model graph.`);return n}async function $(e,n,r,i,a){let o=t(n.outputs,0);if(r.aliases.has(o.id))return[];let s=e=>pn(r,e),c=n.inputs.map(s),l=s(o),u=Qt(n,c,n.outputs.map(s),r,a,(e,t)=>Q(e,t,!1)),d=Math.ceil(S(o.shape)/64),f=u===null?yt(n,c,l,a):null,p=u??(f===null?[]:[{...f,groups:f.groups??[Math.min(d,65535),Math.ceil(d/65535)]}]),m=[];for(let t of p)m.push({...await mn(e,n.op.name,t,i),name:n.op.name,elements:S(o.shape)});return m}async function mn(e,n,r,i){let a=e.createShaderModule({code:r.code,label:n}),o=(await a.getCompilationInfo()).messages.filter(e=>e.type===`error`);if(o.length>0)throw Error(`You called mdl.compile_model with GPU operation ${n}, but its shader failed validation: ${o.map(e=>e.message).join(` `)}. Use the CPU backend and report the shader diagnostics.`);let s=await e.createComputePipelineAsync({layout:`auto`,compute:{module:a,entryPoint:`main`}}),c=r.slots.map((e,n)=>({binding:n,resource:{buffer:t(i,e)}}));if(r.indices!==void 0){let t=fn(e,r.indices.length,`float32`);i.push(t),r.indices.length>0&&e.queue.writeBuffer(t,0,r.indices),c.push({binding:c.length,resource:{buffer:t}})}return{pipeline:s,bindings:e.createBindGroup({layout:s.getBindGroupLayout(0),entries:c}),groups:r.groups}}async function hn(e,t,n,r=`float32`,i=`mdl.compile_model`){let a=le(e,t).outputs,o=Q(a,t,r===`float32`),s=sn(a,o),c=[],l=a.map(e=>te(e.shape)),u=on(a,r),d=cn(n,i),f;try{let e=[];return await d.scoped(async()=>{for(let e of o.sizes)c.push(fn(n,e,r));an(n,[...o.applies.flatMap(e=>[...e.inputs]),...a],o,c,r);for(let t of o.schedule){let i=t.kind===`cluster`?o.plans.get(t):void 0;if(i!==void 0)for(let t of i){let i=rn(t,e=>pn(o,e));e.push({...await mn(n,`fused`,i,c),name:`fused[${t.members.length}]`,elements:S(t.loop_shape)});for(let i of t.rest)e.push(...await $(n,i,o,c,r))}else for(let i of t.kind===`cluster`?t.members:[t.apply])e.push(...await $(n,i,o,c,r))}for(let t of s.copies)e.push(...await $(n,t,o,c,r));f=n.createBuffer({size:u.bytes,usage:9})}),gn(n,t,s.outputs,o,c,e,l,{staging:f,errors:d},r)}catch(e){d.close(),f?.destroy();for(let e of c)e.destroy();throw e}}function gn(e,n,r,i,a,o,s,c,l){let{staging:d,errors:f}=c,p=n.map(e=>new Float32Array(S(e.shape)*A(l))),m=n.map(e=>te(e.shape)),h=!1,g=!1,_={run:async c=>{if(f.check(),g||h)throw Error(`You called mdl.compile_model's GPU evaluator while disposed or running, but the workspace permits one active evaluation. Await the current call or compile a separate workspace.`);if(c.length!==n.length)throw Error(`You called mdl.compile_model's GPU evaluator with the wrong input count, but each free input needs one array. Pass the arrays in the compiled input order.`);c.forEach((e,r)=>{let i=t(n,r).shape;if(e.shape.length!==i.length||e.shape.some((e,t)=>e!==i[t]))throw Error(`You called mdl.compile_model's GPU evaluator with input shape [${e.shape.join(`, `)}], but this input requires shape [${i.join(`, `)}]. Pass an array with the compiled input shape.`)}),h=!0;try{await f.round_trip(()=>{c.forEach((r,o)=>{u(t(m,o),r),Ge(t(p,o),t(m,o).data,l);let s=i.records.get(t(n,o).id)?.slot??-1;t(p,o).length>0&&e.queue.writeBuffer(t(a,s),0,t(p,o))});let s=e.createCommandEncoder();We(s,o);let f=0;r.forEach(e=>{let n=i.records.get(e.id);if(n===void 0)return;let r=S(e.shape)*4*A(l);r>0&&s.copyBufferToBuffer(t(a,n.slot),0,d,f,r),f+=r}),e.queue.submit([s.finish()])},d);try{let e=new Float32Array(d.getMappedRange()),t=0;for(let n of s)Ke(n.data,e,t,l),t+=n.data.length*A(l)}finally{d.unmap()}return s}finally{h=!1}},precision:l,apply_count:i.applies.length,buffer_count:a.length,dispose:()=>{if(h)throw Error(`You called the GPU evaluator's dispose during evaluation, but disposal requires an idle workspace. Await the evaluation before disposing.`);if(!g){g=!0,f.close(),d.destroy();for(let e of a)e.destroy()}}};return He(_,{device:e,precision:l,errors:f,inputs:n.map(e=>t(a,i.records.get(e.id)?.slot??-1)),outputs:r.map(e=>t(a,i.records.get(e.id)?.slot??-1)),dispatch_counts:Uint32Array.from(o.flatMap(e=>[e.groups[0],e.groups[1],e.groups[2]??1])),steps:o,acquire:()=>{if(f.check(),g||h)throw Error(`You called mdl.compile_model with workspace = unavailable, but resident execution requires an idle live workspace. Await the active evaluation or compile another model.`);h=!0;let e=!1;return{encode:(t,n)=>{if(f.check(),e)throw Error(`You called mdl.compile_model with workspace = inactive, but resident execution requires an active lease and live device. Acquire a new lease or compile another model.`);We(t,o,n)},release:()=>{e||(e=!0,h=!1)}}}}),_}async function _n(e,t){if(e.device!==void 0)return e.device;let n=await(globalThis.navigator?.gpu)?.requestAdapter();if(n==null)throw Error(`You called ${t} with backend = webgpu, but no WebGPU adapter is available. Use the CPU backend or a WebGPU-enabled browser.`);let r=n.limits;return n.requestDevice({requiredLimits:{maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxBufferSize:r.maxBufferSize}})}async function vn(e,n,r,i=`mdl.sample_model`){if(n.precision!==`float32`&&n.precision!==`float32x2`)throw Error(`You called ${i} with GPU precision = ${String(n.precision)}, but this backend requires explicit GPU precision. Pass precision = float32 or float32x2, or use the CPU backend for IEEE Float64.`);let a=ve(e,{jacobian:n.jacobian??!0}),o=Be([a.logp,a.gradient],[e.theta],r),s=fe(o.outputs,o.inputs,ge).outputs,c=await _n(n,i);try{let a=4*A(n.precision),l=Math.max(0,...Q(s,o.inputs,n.precision===`float32`).sizes)*a,u=c.limits.maxStorageBufferBindingSize;if(l>u)throw Error(`You called ${i} with chains = ${r} and many_short_chains_in_parallel_on_gpu = true, but the largest buffer of ${r} chains is ${l} bytes and the device binds at most ${u}. Pass chains = ${Math.max(1,Math.floor(u*r/l))} or fewer.`);let d=await hn(s,o.inputs,c,n.precision,i),f=!1;return{backend:`webgpu`,precision:n.precision,chains:r,dimension:e.theta_size,run:async e=>{let n=await d.run([e]);return[t(n,0),t(n,1)]},dispose:()=>{d.dispose(),!f&&n.device===void 0&&c.destroy(),f=!0}}}catch(e){throw n.device===void 0&&c.destroy(),e}}async function yn(e,n,r=`mdl.compile_model`){if(n.precision!==`float32`&&n.precision!==`float32x2`)throw Error(`You called ${r} with GPU precision = ${String(n.precision)}, but this backend requires explicit GPU precision. Pass precision = float32 or float32x2, or use the CPU backend for IEEE Float64.`);let i=ve(e,{jacobian:n.jacobian??!0}),a=await _n(n,r);try{let o=await hn([i.logp,i.gradient],[e.theta],a,n.precision,r),s=!1,c={backend:`webgpu`,precision:n.precision,theta_size:e.theta_size,apply_count:o.apply_count,buffer_count:o.buffer_count,stabilized:i.stabilized,canonicalized:i.canonicalized,logp_and_grad:async e=>{let n=await o.run([e]);return[t(n,0),t(n,1)]},dispose:()=>{o.dispose(),!s&&n.device===void 0&&a.destroy(),s=!0}},l=Ue(o);return l!==void 0&&He(c.logp_and_grad,l),c}catch(e){throw n.device===void 0&&a.destroy(),e}}export{vn as compile_gpu_chains_model,yn as compile_gpu_model};