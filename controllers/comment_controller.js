const Post=require('../models/post');
const Comment=require('../models/comment');
const CommentMailer=require('../mailers/comments_mailer');

module.exports.create=async function(req,res)
{
    try {
        let post=await Post.findById(req.body.post);

        if(post)
        {
            let comment= await Comment.create({
                content:req.body.content,
                
                user:req.user._id,
                post:req.body.post,
            });
                post.comments.push(comment);
                post.save();

                  // Similar for comments to fetch the user's id!
                  comment = await comment.populate('user', 'name email').execPopulate();

                  CommentMailer.newComments(comment); 


                if (req.xhr){
                  
        
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Post created!"
                    });
                }
                req.flash('success','Comment Added');
                return res.redirect('/');
            
        }
        
    } catch (error) {
        req.flash('error',error);
        //console.log("Error",error);
        return res.redirect('back');
        
    }
    
    
}

module.exports.destroy=async function(req,res)
{
    try {
        let comment=await Comment.findById(req.params.id);
    
        if(comment.user==req.user.id)
        {
            let postId=comment.post;
            comment.remove();
            let post= await Post.findByIdAndUpdate(postId,{$pull: {comments:req.params.id}});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            req.flash('success','comment deleted');
            return res.redirect('back');

        }else{
            req.flash('error','You cannot delete this comment');
            return res.redirect('back');
        }
        
    } catch (error) {
        req.flash('error',error);
        //console.log("Error",error);
        return res.redirect('back');

        
    }
       

 
}