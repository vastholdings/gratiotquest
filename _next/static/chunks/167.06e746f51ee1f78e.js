"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[167],{38:function(e,t,r){r.d(t,{o:function(){return $},d:function(){return M}});var i=r(9770),n=r(762),o=r(3907);function s(e,t,r){if(e)for(let i in e){let n=t[i.toLocaleLowerCase()];if(n){let t=e[i];"header"===i&&(t=t.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&n.push(`//----${r}----//`),n.push(t)}else(0,o.Z)(`${i} placement hook does not exist in shader`)}}let u=/\{\{(.*?)\}\}/g;function a(e){let t={};return(e.match(u)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{t[e]=[]}),t}function l(e,t){let r;let i=/@in\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function d(e,t,r=!1){let i=[];l(t,i),e.forEach(e=>{e.header&&l(e.header,i)}),r&&i.sort();let n=i.map((e,t)=>`       @location(${t}) ${e},`).join("\n");return t.replace(/@in\s+[^;]+;\s*/g,"").replace("{{in}}",`
${n}
`)}function c(e,t){let r;let i=/@out\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function f(e,t){let r=e;for(let e in t){let i=t[e];r=i.join("\n").length?r.replace(`{{${e}}}`,`//-----${e} START-----//
${i.join("\n")}
//----${e} FINISH----//`):r.replace(`{{${e}}}`,"")}return r}let m=Object.create(null),h=new Map,p=0;function g(e,t){return t.map(e=>(h.has(e)||h.set(e,p++),h.get(e))).sort((e,t)=>e-t).join("-")+e.vertex+e.fragment}function x(e,t,r){let i=a(e),n=a(t);return r.forEach(e=>{s(e.vertex,i,e.name),s(e.fragment,n,e.name)}),{vertex:f(e,i),fragment:f(t,n)}}let v=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);
        vUV = aUV;

        {{main}}

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,b=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,y=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;

        {{start}}
        
        vColor = vec4(1.);
        vUV = aUV;

        {{main}}

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,P=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,_={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},w={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function M({bits:e,name:t}){let r=function({template:e,bits:t}){let r=g(e,t);if(m[r])return m[r];let{vertex:i,fragment:n}=function(e,t){let r=t.map(e=>e.vertex).filter(e=>!!e),i=t.map(e=>e.fragment).filter(e=>!!e),n=d(r,e.vertex,!0);return{vertex:n=function(e,t){let r=[];c(t,r),e.forEach(e=>{e.header&&c(e.header,r)});let i=0,n=r.sort().map(e=>e.indexOf("builtin")>-1?e:`@location(${i++}) ${e}`).join(",\n"),o=r.sort().map(e=>`       var ${e.replace(/@.*?\s+/g,"")};`).join("\n"),s=`return VSOutput(
                ${r.sort().map(e=>` ${function(e){let t=/\b(\w+)\s*:/g.exec(e);return t?t[1]:""}(e)}`).join(",\n")});`,u=t.replace(/@out\s+[^;]+;\s*/g,"");return(u=(u=u.replace("{{struct}}",`
${n}
`)).replace("{{start}}",`
${o}
`)).replace("{{return}}",`
${s}
`)}(r,n),fragment:d(i,e.fragment,!0)}}(e,t);return m[r]=x(i,n,t),m[r]}({template:{fragment:b,vertex:v},bits:[_,...e]});return n.O.from({name:t,vertex:{source:r.vertex,entryPoint:"main"},fragment:{source:r.fragment,entryPoint:"main"}})}function $({bits:e,name:t}){return new i.J({name:t,...function({template:e,bits:t}){let r=g(e,t);return m[r]||(m[r]=x(e.vertex,e.fragment,t)),m[r]}({template:{vertex:y,fragment:P},bits:[w,...e]})})}},1432:function(e,t,r){r.d(t,{M:function(){return i},T:function(){return n}});let i={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},n={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}}},929:function(e,t,r){r.d(t,{h:function(){return s},m:function(){return n}});let i={};function n(e){return i[e]||(i[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;
    
                ${function(e){let t=[];if(1===e)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let r=0;for(let i=0;i<e;i++)t.push(`@group(1) @binding(${r++}) var textureSource${i+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${r++}) var textureSampler${i+1}: sampler;`)}return t.join("\n")}(16)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                ${function(e){let t=[];if(1===e)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let r=0;r<e;r++)r===e-1?t.push("  default:{"):t.push(`  case ${r}:{`),t.push(`      outColor = textureSampleGrad(textureSource${r+1}, textureSampler${r+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join("\n")}(16)}
            `}}),i[e]}let o={};function s(e){return o[e]||(o[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;
              
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;
    
                uniform sampler2D uTextures[${e}];
              
            `,main:`
    
                ${function(e){let t=[];for(let r=0;r<e;r++)r>0&&t.push("else"),r<e-1&&t.push(`if(vTextureId < ${r}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${r}], vUV);`),t.push("}");return t.join("\n")}(16)}
            `}}),o[e]}},9712:function(e,t,r){r.d(t,{$g:function(){return o},Kt:function(){return n},XH:function(){return i}});let i={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},n={...i,vertex:{...i.vertex,header:i.vertex.header.replace("group(1)","group(2)")}},o={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}}},2631:function(e,t,r){r.d(t,{X:function(){return n},j:function(){return i}});let i={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor((position * 0.5 + 0.5) * targetSize) / targetSize) * 2.0 - 1.0;
            }
        `}},n={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor((position * 0.5 + 0.5) * targetSize) / targetSize) * 2.0 - 1.0;
            }
        `}}},9770:function(e,t,r){let i,n;r.d(t,{J:function(){return f}});var o=r(3245),s=r(5481);let u={},a={},l={stripVersion:function(e,t){return t?e.replace("#version 300 es",""):e},ensurePrecision:function(e,t,r){let i=r?t.maxSupportedFragmentPrecision:t.maxSupportedVertexPrecision;if("precision"!==e.substring(0,9)){let n=r?t.requestedFragmentPrecision:t.requestedVertexPrecision;return"highp"===n&&"highp"!==i&&(n="mediump"),`precision ${n} float;
${e}`}return"highp"!==i&&"precision highp"===e.substring(0,15)?e.replace("precision highp","precision mediump"):e},addProgramDefines:function(e,t,r){return t?e:r?(e=e.replace("out vec4 finalColor;",""),`
        
        #ifdef GL_ES // This checks if it's WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${e}
        `):`
        
        #ifdef GL_ES // This checks if it's WebGL1
        #define in attribute
        #define out varying
        #endif
        ${e}
        `},setProgramName:function(e,{name:t="pixi-program"},r=!0){t=t.replace(/\s+/g,"-")+(r?"-fragment":"-vertex");let i=r?u:a;if(i[t]?(i[t]++,t+=`-${i[t]}`):i[t]=1,-1!==e.indexOf("#define SHADER_NAME"))return e;let n=`#define SHADER_NAME ${t}`;return`${n}
${e}`},insertVersion:function(e,t){return t?`#version 300 es
${e}`:e}},d=Object.create(null),c=class e{constructor(t){let r=-1!==(t={...e.defaultOptions,...t}).fragment.indexOf("#version 300 es"),u={stripVersion:r,ensurePrecision:{requestedFragmentPrecision:t.preferredFragmentPrecision,requestedVertexPrecision:t.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:function(){if(!n){n="mediump";let e=((!i||i?.isContextLost())&&(i=s.z.get().createCanvas().getContext("webgl",{})),i);e&&e.getShaderPrecisionFormat&&(n=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision?"highp":"mediump")}return n}()},setProgramName:{name:t.name},addProgramDefines:r,insertVersion:r},a=t.fragment,d=t.vertex;Object.keys(l).forEach(e=>{let t=u[e];a=l[e](a,t,!0),d=l[e](d,t,!1)}),this.fragment=a,this.vertex=d,this._key=(0,o.Z)(`${this.vertex}:${this.fragment}`,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null}static from(t){let r=`${t.vertex}:${t.fragment}`;return d[r]||(d[r]=new e(t)),d[r]}};c.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"};let f=c},762:function(e,t,r){r.d(t,{O:function(){return d}});var i,n=r(3245),o=r(397);let s={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function u(e){let t=/@group\((\d+)\)/,r=/@binding\((\d+)\)/,i=/var(<[^>]+>)? (\w+)/,n=/:\s*(\w+)/,o=/(\w+)\s*:\s*([\w\<\>]+)/g,s=/struct\s+(\w+)/,u=e.match(/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g)?.map(e=>({group:parseInt(e.match(t)[1],10),binding:parseInt(e.match(r)[1],10),name:e.match(i)[2],isUniform:"<uniform>"===e.match(i)[1],type:e.match(n)[1]}));if(!u)return{groups:[],structs:[]};let a=e.match(/struct\s+(\w+)\s*{([^}]+)}/g)?.map(e=>{let t=e.match(s)[1],r=e.match(o).reduce((e,t)=>{let[r,i]=t.split(":");return e[r.trim()]=i.trim(),e},{});return r?{name:t,members:r}:null}).filter(({name:e})=>u.some(t=>t.type===e))??[];return{groups:u,structs:a}}var a=((i=a||{})[i.VERTEX=1]="VERTEX",i[i.FRAGMENT=2]="FRAGMENT",i[i.COMPUTE=4]="COMPUTE",i);let l=Object.create(null);class d{constructor(e){this._layoutKey=0;let{fragment:t,vertex:r,layout:i,gpuLayout:n,name:o}=e;if(this.name=o,this.fragment=t,this.vertex=r,t.source===r.source){let e=u(t.source);this.structsAndGroups=e}else{let e=u(r.source),i=u(t.source);this.structsAndGroups=function(e,t){let r=new Set,i=new Set;return{structs:[...e.structs,...t.structs].filter(e=>!r.has(e.name)&&(r.add(e.name),!0)),groups:[...e.groups,...t.groups].filter(e=>{let t=`${e.name}-${e.binding}`;return!i.has(t)&&(i.add(t),!0)})}}(e,i)}this.layout=i??function({groups:e}){let t=[];for(let r=0;r<e.length;r++){let i=e[r];t[i.group]||(t[i.group]={}),t[i.group][i.name]=i.binding}return t}(this.structsAndGroups),this.gpuLayout=n??function({groups:e}){let t=[];for(let r=0;r<e.length;r++){let i=e[r];t[i.group]||(t[i.group]=[]),i.isUniform?t[i.group].push({binding:i.binding,visibility:a.VERTEX|a.FRAGMENT,buffer:{type:"uniform"}}):"sampler"===i.type?t[i.group].push({binding:i.binding,visibility:a.FRAGMENT,sampler:{type:"filtering"}}):"texture_2d"===i.type&&t[i.group].push({binding:i.binding,visibility:a.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return t}(this.structsAndGroups),this.autoAssignGlobalUniforms=this.layout[0]?.globalUniforms!==void 0,this.autoAssignLocalUniforms=this.layout[1]?.localUniforms!==void 0,this._generateProgramKey()}_generateProgramKey(){let{vertex:e,fragment:t}=this,r=e.source+t.source+e.entryPoint+t.entryPoint;this._layoutKey=(0,n.Z)(r,"program")}get attributeData(){return this._attributeData??(this._attributeData=function({source:e,entryPoint:t}){let r={},i=e.indexOf(`fn ${t}`);if(-1!==i){let t=e.indexOf("->",i);if(-1!==t){let n;let u=e.substring(i,t),a=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;for(;null!==(n=a.exec(u));){let e=s[n[3]]??"float32";r[n[2]]={location:parseInt(n[1],10),format:e,stride:(0,o.v)(e).stride,offset:0,instance:!1,start:0}}}}return r}(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null}static from(e){let t=`${e.vertex.source}:${e.fragment.source}:${e.fragment.entryPoint}:${e.vertex.entryPoint}`;return l[t]||(l[t]=new d(e)),l[t]}}},397:function(e,t,r){r.d(t,{v:function(){return n}});let i={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}};function n(e){return i[e]??i.float32}},6400:function(e,t,r){r.d(t,{e:function(){return l}});var i=r(2942),n=r(9770),o=r(5617),s=r(762),u=r(3799),a=r(3872);class l extends i.Z{constructor(e){super(),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:t,glProgram:r,groups:i,resources:n,compatibleRenderers:s,groupMap:l}=e;this.gpuProgram=t,this.glProgram=r,void 0===s&&(s=0,t&&(s|=u.g.WEBGPU),r&&(s|=u.g.WEBGL)),this.compatibleRenderers=s;let d={};if(n||i||(n={}),n&&i)throw Error("[Shader] Cannot have both resources and groups");if(t||!i||l){if(!t&&i&&l)for(let e in l)for(let t in l[e]){let r=l[e][t];d[r]={group:e,binding:t,name:r}}else if(t&&i&&!l){let e=t.structsAndGroups.groups;l={},e.forEach(e=>{l[e.group]=l[e.group]||{},l[e.group][e.binding]=e.name,d[e.name]=e})}else if(n){if(t){let e=t.structsAndGroups.groups;l={},e.forEach(e=>{l[e.group]=l[e.group]||{},l[e.group][e.binding]=e.name,d[e.name]=e})}else{l={},i={99:new o.v},this._ownedBindGroups.push(i[99]);let e=0;for(let t in n)d[t]={group:99,binding:e,name:t},l[99]=l[99]||{},l[99][e]=t,e++}for(let e in i={},n){let t=n[e];t.source||t._resourceType||(t=new a.o(t));let r=d[e];r&&(i[r.group]||(i[r.group]=new o.v,this._ownedBindGroups.push(i[r.group])),i[r.group].setResource(t,r.binding))}}}else throw Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");this.groups=i,this._uniformBindMap=l,this.resources=this._buildResourceAccessor(i,d)}addResource(e,t,r){var i,n;(i=this._uniformBindMap)[t]||(i[t]={}),(n=this._uniformBindMap[t])[r]||(n[r]=e),this.groups[t]||(this.groups[t]=new o.v,this._ownedBindGroups.push(this.groups[t]))}_buildResourceAccessor(e,t){let r={};for(let i in t){let n=t[i];Object.defineProperty(r,n.name,{get:()=>e[n.group].getResource(n.binding),set(t){e[n.group].setResource(t,n.binding)}})}return r}destroy(e=!1){this.emit("destroy",this),e&&(this.gpuProgram?.destroy(),this.glProgram?.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach(e=>{e.destroy()}),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(e){let t,r;let{gpu:i,gl:o,...u}=e;return i&&(t=s.O.from(i)),o&&(r=n.J.from(o)),new l({gpuProgram:t,glProgram:r,...u})}}},3872:function(e,t,r){r.d(t,{o:function(){return s}});var i=r(8765),n=r(3245);let o=class e{constructor(t,r){this._touched=0,this.uid=(0,i.h)("uniform"),this._resourceType="uniformGroup",this._resourceId=(0,i.h)("resource"),this.isUniformGroup=!0,this._dirtyId=0,r={...e.defaultOptions,...r},this.uniformStructures=t;let o={};for(let e in t){let r=t[e];r.name=e,r.size=r.size??1,r.value??(r.value=function(e,t){switch(e){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*t);case"vec3<f32>":return new Float32Array(3*t);case"vec4<f32>":return new Float32Array(4*t);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}(r.type,r.size)),o[e]=r.value}this.uniforms=o,this._dirtyId=1,this.ubo=r.ubo,this.isStatic=r.isStatic,this._signature=(0,n.Z)(Object.keys(o).map(e=>`${e}-${t[e].type}`).join("-"),"uniform-group")}update(){this._dirtyId++}};o.defaultOptions={ubo:!1,isStatic:!1};let s=o},3976:function(e,t,r){r.d(t,{Z:function(){return o}});let i={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8},n=class e{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(1&this.data)}set blend(e){!!(1&this.data)!==e&&(this.data^=1)}get offsets(){return!!(2&this.data)}set offsets(e){!!(2&this.data)!==e&&(this.data^=2)}set cullMode(e){if("none"===e){this.culling=!1;return}this.culling=!0,this.clockwiseFrontFace="front"===e}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(4&this.data)}set culling(e){!!(4&this.data)!==e&&(this.data^=4)}get depthTest(){return!!(8&this.data)}set depthTest(e){!!(8&this.data)!==e&&(this.data^=8)}get depthMask(){return!!(32&this.data)}set depthMask(e){!!(32&this.data)!==e&&(this.data^=32)}get clockwiseFrontFace(){return!!(16&this.data)}set clockwiseFrontFace(e){!!(16&this.data)!==e&&(this.data^=16)}get blendMode(){return this._blendMode}set blendMode(e){this.blend="none"!==e,this._blendMode=e,this._blendModeId=i[e]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(e){this.offsets=!!e,this._polygonOffset=e}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){let t=new e;return t.depthTest=!1,t.blend=!0,t}};n.default2d=n.for2d();let o=n},955:function(e,t,r){r.d(t,{z:function(){return a}});var i=r(9992),n=r(5274),o=r(8462);let s=0;class u{constructor(e){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=e||{},this.enableFullScreen=!1}createTexture(e,t,r){let i=new n.p({...this.textureOptions,width:e,height:t,resolution:1,antialias:r,autoGarbageCollect:!0});return new o.x({source:i,label:`texturePool_${s++}`})}getOptimalTexture(e,t,r=1,n){let o=Math.ceil(e*r-1e-6),s=Math.ceil(t*r-1e-6),u=((o=(0,i.a9)(o))<<17)+((s=(0,i.a9)(s))<<1)+(n?1:0);this._texturePool[u]||(this._texturePool[u]=[]);let a=this._texturePool[u].pop();return a||(a=this.createTexture(o,s,n)),a.source._resolution=r,a.source.width=o/r,a.source.height=s/r,a.source.pixelWidth=o,a.source.pixelHeight=s,a.frame.x=0,a.frame.y=0,a.frame.width=e,a.frame.height=t,a.updateUvs(),this._poolKeyHash[a.uid]=u,a}getSameSizeTexture(e,t=!1){let r=e.source;return this.getOptimalTexture(e.width,e.height,r._resolution,t)}returnTexture(e){let t=this._poolKeyHash[e.uid];this._texturePool[t].push(e)}clear(e){if(e=!1!==e)for(let e in this._texturePool){let t=this._texturePool[e];if(t)for(let e=0;e<t.length;e++)t[e].destroy(!0)}this._texturePool={}}}let a=new u},3245:function(e,t,r){r.d(t,{Z:function(){return o}});let i=Object.create(null),n=Object.create(null);function o(e,t){let r=n[e];return void 0===r&&(void 0===i[t]&&(i[t]=1),n[e]=r=i[t]++),r}},3799:function(e,t,r){r.d(t,{g:function(){return n}});var i,n=((i=n||{})[i.WEBGL=1]="WEBGL",i[i.WEBGPU=2]="WEBGPU",i[i.BOTH=3]="BOTH",i)},9362:function(e,t,r){r.d(t,{V:function(){return i}});function i(e,t,r){let i=(e>>24&255)/255;t[r++]=(255&e)/255*i,t[r++]=(e>>8&255)/255*i,t[r++]=(e>>16&255)/255*i,t[r++]=i}},7654:function(e,t,r){r.d(t,{c:function(){return i}});class i{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(e,t,r,i){let n=this.renderable,o=this.texture,s=n.groupTransform,u=s.a,a=s.b,l=s.c,d=s.d,c=s.tx,f=s.ty,m=this.bounds,h=m.maxX,p=m.minX,g=m.maxY,x=m.minY,v=o.uvs,b=n.groupColorAlpha,y=i<<16|65535&this.roundPixels;e[r+0]=u*p+l*x+c,e[r+1]=d*x+a*p+f,e[r+2]=v.x0,e[r+3]=v.y0,t[r+4]=b,t[r+5]=y,e[r+6]=u*h+l*x+c,e[r+7]=d*x+a*h+f,e[r+8]=v.x1,e[r+9]=v.y1,t[r+10]=b,t[r+11]=y,e[r+12]=u*h+l*g+c,e[r+13]=d*g+a*h+f,e[r+14]=v.x2,e[r+15]=v.y2,t[r+16]=b,t[r+17]=y,e[r+18]=u*p+l*g+c,e[r+19]=d*g+a*p+f,e[r+20]=v.x3,e[r+21]=v.y3,t[r+22]=b,t[r+23]=y}packIndex(e,t,r){e[t]=r+0,e[t+1]=r+1,e[t+2]=r+2,e[t+3]=r+0,e[t+4]=r+2,e[t+5]=r+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}}}]);