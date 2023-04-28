## Modules

<dl>
<dt><a href="#module_api">api</a></dt>
<dd><p>api module</p>
</dd>
<dt><a href="#module_filter">filter</a></dt>
<dd><p>filter module</p>
</dd>
<dt><a href="#module_getter">getter</a></dt>
<dd><p>getter module</p>
</dd>
</dl>

<a name="module_api"></a>

## api
api module


* [api](#module_api)
    * [~getHistory(code, startDate, endDate)](#module_api..getHistory) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [~isOpen(date)](#module_api..isOpen) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [~getAll()](#module_api..getAll) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [~getTodayAll()](#module_api..getTodayAll) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [~getDaDan(code)](#module_api..getDaDan) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [~getUpDown(code)](#module_api..getUpDown) ⇒ <code>Object</code>

<a name="module_api..getHistory"></a>

### api~getHistory(code, startDate, endDate) ⇒ <code>Promise.&lt;Array&gt;</code>
获取股票历史行情数据

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - {
    "date": "2021-08-17",
    "symbol": "sz301046",
    "code": "301046",
    "name": "N能辉",
    "trade": 52.05,
    "pricechange": 43.71,
    "changepercent": 524.101,
    "buy": 52.04,
    "sell": 52.05,
    "settlement": 8.34,
    "open": 48,
    "high": 55.55,
    "low": 45.2,
    "volume": 26654748,
    "amount": 1351235060,
    "ticktime": "15:35:00",
    "per": 0,
    "pb": 12.815,
    "mktcap": 778043.4,
    "nmc": 184454.6859,
    "turnoverratio": 75.2152
  }  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | 股票代码，如'600001' |
| startDate | <code>String</code> | 开始日期，如'2021-08-17' |
| endDate | <code>String</code> | 结束日期，如'2021-08-17' |

<a name="module_api..isOpen"></a>

### api~isOpen(date) ⇒ <code>Promise.&lt;Boolean&gt;</code>
查看指定日期是否开盘

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - true or false  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>String</code> | 日期，如'2021-08-08' |

<a name="module_api..getAll"></a>

### api~getAll() ⇒ <code>Promise.&lt;Array&gt;</code>
获取今日全部股票行情

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - 数组，某一个item，如下：  
<a name="module_api..getTodayAll"></a>

### api~getTodayAll() ⇒ <code>Promise.&lt;Array&gt;</code>
获取今日全部股票行情

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - 数组，某一个item  
<a name="module_api..getDaDan"></a>

### api~getDaDan(code) ⇒ <code>Promise.&lt;Object&gt;</code>
获取大单信息

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - {
      superFlow,
      bigFlow,
      middleFlow,
      smallFlow
    }  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | 股票代码 |

<a name="module_api..getUpDown"></a>

### api~getUpDown(code) ⇒ <code>Object</code>
获取看涨和看跌的人数

**Kind**: inner method of [<code>api</code>](#module_api)  
**Returns**: <code>Object</code> - {
      up: 1,
      down: 2
    }  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | 代码 |

<a name="module_filter"></a>

## filter
filter module


* [filter](#module_filter)
    * [~removeST(list)](#module_filter..removeST) ⇒ <code>Array</code>
    * [~removeKechuang(list)](#module_filter..removeKechuang) ⇒ <code>Array</code>
    * [~byPrice(list, lowPrice, highPrice)](#module_filter..byPrice) ⇒ <code>Array</code>
    * [~byRatio(list, lowRatio, highRatio)](#module_filter..byRatio) ⇒ <code>Array</code>
    * [~byChangePercent(list, lowPercent, highPercent)](#module_filter..byChangePercent) ⇒ <code>Array</code>
    * [~byAmount(list, lowAmount, lowAmount)](#module_filter..byAmount) ⇒ <code>Array</code>
    * [~getRedT(list)](#module_filter..getRedT) ⇒ <code>Array</code>
    * [~getRealRedT(list)](#module_filter..getRealRedT) ⇒ <code>Array</code>
    * [~getChuangye(list)](#module_filter..getChuangye) ⇒ <code>Array</code>
    * [~macd(ticks)](#module_filter..macd) ⇒ <code>object</code>

<a name="module_filter..removeST"></a>

### filter~removeST(list) ⇒ <code>Array</code>
移除ST

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_filter..removeKechuang"></a>

### filter~removeKechuang(list) ⇒ <code>Array</code>
移除科创股（因为我穷，还没法买😢）

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_filter..byPrice"></a>

### filter~byPrice(list, lowPrice, highPrice) ⇒ <code>Array</code>
根据价格，筛选

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>Array</code> |  | 行情数组 |
| lowPrice | <code>Number</code> | <code>0</code> | 最低价，默认0 |
| highPrice | <code>Number</code> | <code>3000</code> | 最高价，默认3000 |

<a name="module_filter..byRatio"></a>

### filter~byRatio(list, lowRatio, highRatio) ⇒ <code>Array</code>
根据换手率，筛选

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>Array</code> |  | 行情数组 |
| lowRatio | <code>Number</code> | <code>0</code> | 最低换手率，默认0 |
| highRatio | <code>Number</code> | <code>100</code> | 最高换手率，默认100 |

<a name="module_filter..byChangePercent"></a>

### filter~byChangePercent(list, lowPercent, highPercent) ⇒ <code>Array</code>
根据涨跌幅度，筛选

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>Array</code> |  | 行情数组 |
| lowPercent | <code>Number</code> |  | 最低涨跌幅度，默认-20 |
| highPercent | <code>Number</code> | <code>20</code> | 最高涨跌幅度，默认20 |

<a name="module_filter..byAmount"></a>

### filter~byAmount(list, lowAmount, lowAmount) ⇒ <code>Array</code>
根据成交额，筛选

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>Aarray</code> |  | 行情数组 |
| lowAmount | <code>Number</code> | <code>10000000</code> | 最低成交额，默认10000000（一千万） |
| lowAmount | <code>Number</code> |  | 最高成交额 |

<a name="module_filter..getRedT"></a>

### filter~getRedT(list) ⇒ <code>Array</code>
获取redT，但不是平头

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_filter..getRealRedT"></a>

### filter~getRealRedT(list) ⇒ <code>Array</code>
获取平头redT，

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_filter..getChuangye"></a>

### filter~getChuangye(list) ⇒ <code>Array</code>
获取创业股

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_filter..macd"></a>

### filter~macd(ticks) ⇒ <code>object</code>
获取macd

**Kind**: inner method of [<code>filter</code>](#module_filter)  
**Returns**: <code>object</code> - ，如下：{
  macds,
  diffs,
  deas
}  

| Param | Type | Description |
| --- | --- | --- |
| ticks | <code>array</code> | 价格数组，最近一日的价格在数组第一个 |

<a name="module_getter"></a>

## getter
getter module


* [getter](#module_getter)
    * [~withRedT(list)](#module_getter..withRedT) ⇒ <code>Array</code>
    * [~withMacd(list)](#module_getter..withMacd) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [~withDadan(list)](#module_getter..withDadan) ⇒ <code>Promise.&lt;Array&gt;</code>

<a name="module_getter..withRedT"></a>

### getter~withRedT(list) ⇒ <code>Array</code>
分析，红T

**Kind**: inner method of [<code>getter</code>](#module_getter)  
**Returns**: <code>Array</code> - 数组  

| Param | Type |
| --- | --- |
| list | <code>Array</code> | 

<a name="module_getter..withMacd"></a>

### getter~withMacd(list) ⇒ <code>Promise.&lt;Array&gt;</code>
分析，macd

**Kind**: inner method of [<code>getter</code>](#module_getter)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - 数组  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

<a name="module_getter..withDadan"></a>

### getter~withDadan(list) ⇒ <code>Promise.&lt;Array&gt;</code>
返回大单入的股

**Kind**: inner method of [<code>getter</code>](#module_getter)  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array</code> | 行情数组 |

