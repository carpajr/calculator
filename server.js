/* File     : server.js
 * Author   : almeidajr@gmail.com
 * Date     : 03/04/2018
 * 
 * Desc     : NodeJs application  
 */

var express    = require('express')
var bodyParser = require('body-parser')    // To handle post requisitons protocols
var app        = express()            

app.use(express.static(__dirname))         // To handle html file
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.post('/calculate', (req, res) => {
    req.body.result = calc(req.body.expr) // Calculate
    res.json(req.body)
})

var server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})


/* 
* postfix - convert infix notation to reverse polish
*  
* This is a simplified implementation of Shunting-yard with Postfix Calculator Algorithm
* Based on Edsger Dijkstra algorithm <https://en.wikipedia.org/wiki/Shunting-yard_algorithm>
* Return: array[]
*/
function postfix(expr) {

    expr = expr.split('')
    /* Shunting-yard is based on stack and queue data structures */
    var stack = [], queue = []                          
    var exp_function = '', exp_number = ''
    var s_top, previousIsFunction = false
    
    /* Operands precedence */
    var precedence = {"*": 3, "/": 3, "+": 2, "-": 2 }  

    /* 
     * Parsing expression 
     */
    for (var i = 0; i < expr.length; i++) {

        /* Is token an operand ? */
        if ( isNaN(expr[i]) && expr[i] !== '.' && !previousIsFunction ) {
            
            /* Handling negative numbers at start of expression */
            if( expr[i] === '-' && i === 0 ) {      
                queue.push('0') 
            }
            exp_function = expr[i]
            previousIsFunction = true
            
            // Checking precedence
            if ( stack.length > 0 ) {
                s_top = stack[stack.length-1] 
                if ( precedence[exp_function] <= precedence[s_top] ) {
                    while ( stack.length > 0 ) {
                        queue.push(stack.pop())
                    }
                }
            }
            // add operand to stack
            stack.push(exp_function)
            
        }
        else {
            /* Is token a number? */
            exp_number = "" + exp_number + expr[i]

            if ( isNaN(expr[i+1]) && expr[i+1] !== '.' ) {
                queue.push(exp_number)
                exp_number = "" 
            }
            previousIsFunction = false;
        } 


    }

    /* Ending postfix notation */
    while ( stack.length > 0 ) { 
        queue.push(stack.pop())
    }  

    return queue
}

/* 
* calc - compute reverse polish expresion
* Valid operations *, /, +, -
* Return: float
*/
function calc(expr) {
    // right and left operands
    var rOp, lOp 
    var  stack = [], queue = postfix(expr)

    while ( queue.length > 0 ) {
        token = queue.shift()

        if ( isNaN(token) ) {
            rOp = stack.pop();
            lOp = stack.pop();
            stack.push(eval(lOp + token + rOp))
        }
        else {
            stack.push(token)
        }
    }
    return stack.pop()
}
