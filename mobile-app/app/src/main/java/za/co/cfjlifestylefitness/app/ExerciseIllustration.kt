package za.co.cfjlifestylefitness.app

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.view.View

// Original movement diagrams show the start and finish alongside the written form cues.
class ExerciseIllustration(context: Context, private val movement: Int) : View(context) {
    private val ink = Paint(Paint.ANTI_ALIAS_FLAG).apply { strokeCap = Paint.Cap.ROUND }
    init { contentDescription = when(movement) { 0 -> "Sit to stand: seated position then standing position"; 1 -> "Wall press-up: arms extended then elbows bent towards wall"; else -> "Calf raise: heels grounded then lifted while holding support" } }
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.save(); canvas.scale(width / 600f, height / 300f)
        canvas.drawColor(Color.rgb(18, 40, 70))
        fun line(x: Float, y: Float, x2: Float, y2: Float, color: Int = Color.rgb(147,197,253), thick: Float = 12f) {
            ink.color=color;ink.strokeWidth=thick;canvas.drawLine(x,y,x2,y2,ink)
        }
        for (step in 0..1) {
            val x=70f+step*300
            ink.color=Color.WHITE;ink.textSize=20f;canvas.drawText(if(step==0) "START" else "FINISH",x,30f,ink)
            val seated=movement==0 && step==0
            val headX=x+if(movement==1 && step==1) 75f else 45f
            val headY=if(seated) 100f else if(movement==2 && step==1) 65f else 80f
            ink.color=Color.rgb(220,232,247);canvas.drawCircle(headX,headY,16f,ink)
            val hipX=x+45f;val hipY=if(seated) 190f else 170f
            line(headX,headY+22,hipX,hipY)
            if(seated) {
                line(hipX,hipY,x+105,hipY);line(x+105,hipY,x+105,245f)
                line(x+15,205f,x+70,205f,Color.GRAY,6f);line(x+20,205f,x+20,250f,Color.GRAY,6f)
            } else {
                val footY=if(movement==2 && step==1) 232f else 250f
                line(hipX,hipY,x+25,footY);line(hipX,hipY,x+75,footY)
            }
            if(movement==1) {
                line(x+150,60f,x+150,255f,Color.GRAY,6f)
                line(headX,headY+35,x+110,150f);line(x+110,150f,x+150,120f)
            } else if(movement==2) {
                line(headX,headY+35,x+130,140f);line(x+130,140f,x+130,250f,Color.GRAY,6f)
            } else line(headX,headY+35,x+100,165f)
            line(x,260f,x+200,260f,Color.rgb(70,90,120),3f)
        }
        canvas.restore()
    }
}
